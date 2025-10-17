import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup, Badge, ProgressBar, InputGroup, Modal } from 'react-bootstrap';

const PremiumPlanner = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ 
    text: '', 
    priority: 'medium', 
    category: 'personal',
    dueDate: '',
    estimatedTime: ''
  });
  const [filter, setFilter] = useState('all');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const savedTasks = localStorage.getItem(`premium_planner_${user?.id}`);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, [user]);

  const addTask = () => {
    if (!newTask.text.trim()) return;
    
    const task = {
      id: Date.now(),
      ...newTask,
      completed: false,
      createdAt: new Date().toISOString(),
      timeSpent: 0
    };
    
    const updatedTasks = [task, ...tasks];
    setTasks(updatedTasks);
    localStorage.setItem(`premium_planner_${user?.id}`, JSON.stringify(updatedTasks));
    setNewTask({ 
      text: '', 
      priority: 'medium', 
      category: 'personal',
      dueDate: '',
      estimatedTime: ''
    });
    setShowTaskModal(false);
  };

  const toggleTask = (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem(`premium_planner_${user?.id}`, JSON.stringify(updatedTasks));
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem(`premium_planner_${user?.id}`, JSON.stringify(updatedTasks));
  };

  const getPriorityColor = (priority) => {
    const colors = { high: 'danger', medium: 'warning', low: 'info' };
    return colors[priority];
  };

  const getCategoryIcon = (category) => {
    const icons = {
      personal: '👤',
      work: '💼',
      health: '🏥',
      learning: '📚',
      social: '👥',
      finance: '💰',
      creative: '🎨'
    };
    return icons[category];
  };

  const getFilteredTasks = () => {
    switch (filter) {
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'pending':
        return tasks.filter(task => !task.completed);
      case 'high':
        return tasks.filter(task => task.priority === 'high' && !task.completed);
      case 'today':
        const today = new Date().toDateString();
        return tasks.filter(task => 
          task.dueDate && new Date(task.dueDate).toDateString() === today
        );
      default:
        return tasks;
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const highPriorityTasks = tasks.filter(task => task.priority === 'high' && !task.completed).length;
  const todayTasks = tasks.filter(task => {
    const today = new Date().toDateString();
    return task.dueDate && new Date(task.dueDate).toDateString() === today;
  }).length;

  const filteredTasks = getFilteredTasks();

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={12} xl={10}>
          {/* Header */}
          <div className="text-center mb-5 fade-in">
            <h1 className="display-5 fw-bold text-gradient mb-3">🚀 Premium Task Manager</h1>
            <p className="lead text-muted">Smart planning for peak productivity and mental clarity</p>
          </div>

          {/* Stats Overview */}
          <Row className="g-4 mb-5">
            <Col md={3} sm={6}>
              <Card className="saas-card border-0 text-center h-100 stats-card">
                <Card.Body className="p-4">
                  <div className="stats-icon mb-3">📝</div>
                  <div className="display-6 text-primary mb-2 fw-bold">{totalTasks}</div>
                  <Card.Title className="small fw-semibold">Total Tasks</Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="saas-card border-0 text-center h-100 stats-card">
                <Card.Body className="p-4">
                  <div className="stats-icon mb-3">✅</div>
                  <div className="display-6 text-success mb-2 fw-bold">{completedTasks}</div>
                  <Card.Title className="small fw-semibold">Completed</Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="saas-card border-0 text-center h-100 stats-card">
                <Card.Body className="p-4">
                  <div className="stats-icon mb-3">🔥</div>
                  <div className="display-6 text-danger mb-2 fw-bold">{highPriorityTasks}</div>
                  <Card.Title className="small fw-semibold">High Priority</Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="saas-card border-0 text-center h-100 stats-card">
                <Card.Body className="p-4">
                  <div className="stats-icon mb-3">📊</div>
                  <div className="display-6 text-info mb-2 fw-bold">{completionRate}%</div>
                  <Card.Title className="small fw-semibold">Completion Rate</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-4">
            {/* Quick Actions Sidebar */}
            <Col lg={3}>
              <Card className="saas-card border-0 shadow-lg h-100">
                <Card.Header className="bg-gradient-primary text-white border-0 py-3">
                  <h5 className="mb-0">⚡ Quick Actions</h5>
                </Card.Header>
                <Card.Body className="p-0">
                  <ListGroup variant="flush">
                    <ListGroup.Item 
                      className="border-0 p-3 quick-action-item"
                      onClick={() => setShowTaskModal(true)}
                    >
                      <div className="d-flex align-items-center">
                        <span className="quick-action-icon">➕</span>
                        <div>
                          <h6 className="mb-1">Add New Task</h6>
                          <small className="text-muted">Create a new task</small>
                        </div>
                      </div>
                    </ListGroup.Item>
                    
                    <ListGroup.Item 
                      className="border-0 p-3 quick-action-item"
                      onClick={() => setFilter('today')}
                    >
                      <div className="d-flex align-items-center">
                        <span className="quick-action-icon">📅</span>
                        <div>
                          <h6 className="mb-1">Today's Tasks</h6>
                          <small className="text-muted">{todayTasks} due today</small>
                        </div>
                      </div>
                    </ListGroup.Item>
                    
                    <ListGroup.Item 
                      className="border-0 p-3 quick-action-item"
                      onClick={() => setFilter('high')}
                    >
                      <div className="d-flex align-items-center">
                        <span className="quick-action-icon">🚨</span>
                        <div>
                          <h6 className="mb-1">Urgent Tasks</h6>
                          <small className="text-muted">{highPriorityTasks} high priority</small>
                        </div>
                      </div>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>

              {/* Progress Overview */}
              {totalTasks > 0 && (
                <Card className="saas-card border-0 shadow-lg mt-4">
                  <Card.Header className="bg-light border-0 py-3">
                    <h6 className="mb-0">📈 Progress Overview</h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-4">
                      <div className="d-flex justify-content-between mb-2">
                        <small className="fw-semibold">Overall Progress</small>
                        <small className="fw-bold text-primary">{completionRate}%</small>
                      </div>
                      <ProgressBar 
                        now={completionRate} 
                        variant="success" 
                        style={{height: '10px', borderRadius: '10px'}} 
                      />
                    </div>
                    
                    <div className="progress-details">
                      <div className="progress-item d-flex justify-content-between mb-2">
                        <span>✅ Completed</span>
                        <strong className="text-success">{completedTasks}</strong>
                      </div>
                      <div className="progress-item d-flex justify-content-between mb-2">
                        <span>⏳ Pending</span>
                        <strong className="text-warning">{totalTasks - completedTasks}</strong>
                      </div>
                      <div className="progress-item d-flex justify-content-between">
                        <span>🚨 Urgent</span>
                        <strong className="text-danger">{highPriorityTasks}</strong>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              )}
            </Col>

            {/* Main Tasks Panel */}
            <Col lg={9}>
              {/* Filters Bar */}
              <Card className="saas-card border-0 shadow-lg mb-4">
                <Card.Body className="py-3">
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        variant={filter === 'all' ? 'primary' : 'outline-primary'}
                        size="sm"
                        onClick={() => setFilter('all')}
                        className="filter-btn"
                      >
                        All Tasks ({tasks.length})
                      </Button>
                      <Button
                        variant={filter === 'pending' ? 'warning' : 'outline-warning'}
                        size="sm"
                        onClick={() => setFilter('pending')}
                        className="filter-btn"
                      >
                        ⏳ Pending ({tasks.filter(t => !t.completed).length})
                      </Button>
                      <Button
                        variant={filter === 'high' ? 'danger' : 'outline-danger'}
                        size="sm"
                        onClick={() => setFilter('high')}
                        className="filter-btn"
                      >
                        🚨 High Priority ({highPriorityTasks})
                      </Button>
                      <Button
                        variant={filter === 'today' ? 'info' : 'outline-info'}
                        size="sm"
                        onClick={() => setFilter('today')}
                        className="filter-btn"
                      >
                        📅 Today ({todayTasks})
                      </Button>
                    </div>
                    
                    <Button
                      className="btn-saas btn-saas-primary"
                      onClick={() => setShowTaskModal(true)}
                    >
                      ➕ New Task
                    </Button>
                  </div>
                </Card.Body>
              </Card>

              {/* Tasks List */}
              {filteredTasks.length === 0 ? (
                <Card className="saas-card border-0 text-center py-5 empty-state">
                  <Card.Body>
                    <div className="empty-icon mb-4">📝</div>
                    <h4 className="text-gradient mb-3">
                      {filter === 'all' ? "No tasks yet!" : `No ${filter} tasks found`}
                    </h4>
                    <p className="text-muted mb-4">
                      {filter === 'all' 
                        ? "Get started by creating your first task!" 
                        : `Try changing your filters to see more tasks.`
                      }
                    </p>
                    <Button 
                      className="btn-saas btn-saas-primary"
                      onClick={() => setShowTaskModal(true)}
                    >
                      Create Your First Task
                    </Button>
                  </Card.Body>
                </Card>
              ) : (
                <div className="tasks-container">
                  {filteredTasks.map(task => (
                    <Card key={task.id} className="saas-card border-0 mb-3 task-item">
                      <Card.Body className="p-4">
                        <div className="d-flex align-items-start">
                          <div className="task-checkbox me-3">
                            <Form.Check
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => toggleTask(task.id)}
                              className="custom-checkbox"
                            />
                          </div>
                          
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <div className="d-flex align-items-center">
                                <span className="task-category-icon me-3">
                                  {getCategoryIcon(task.category)}
                                </span>
                                <div>
                                  <h6 className={`mb-0 task-title ${task.completed ? 'completed' : ''}`}>
                                    {task.text}
                                  </h6>
                                  <div className="task-meta mt-1">
                                    {task.dueDate && (
                                      <Badge bg="outline-secondary" className="me-2">
                                        📅 {new Date(task.dueDate).toLocaleDateString()}
                                      </Badge>
                                    )}
                                    {task.estimatedTime && (
                                      <Badge bg="outline-info" className="me-2">
                                        ⏱️ {task.estimatedTime}h
                                      </Badge>
                                    )}
                                    <small className="text-muted">
                                      Added: {new Date(task.createdAt).toLocaleDateString()}
                                    </small>
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex align-items-center gap-2">
                                <Badge bg={getPriorityColor(task.priority)} className="priority-badge">
                                  {task.priority} priority
                                </Badge>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => deleteTask(task.id)}
                                  className="delete-btn"
                                >
                                  🗑️
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )}
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Add Task Modal */}
      <Modal show={showTaskModal} onHide={() => setShowTaskModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="text-gradient">➕ Add New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">Task Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="What needs to be accomplished?"
                value={newTask.text}
                onChange={(e) => setNewTask({...newTask, text: e.target.value})}
                className="rounded-2 py-3"
                autoFocus
              />
            </Form.Group>

            <Row className="g-3 mb-4">
              <Col md={6}>
                <Form.Label className="fw-semibold">Priority Level</Form.Label>
                <Form.Select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                  className="rounded-2 py-2"
                >
                  <option value="low">🔵 Low Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="high">🔴 High Priority</option>
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Label className="fw-semibold">Category</Form.Label>
                <Form.Select
                  value={newTask.category}
                  onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                  className="rounded-2 py-2"
                >
                  <option value="personal">👤 Personal</option>
                  <option value="work">💼 Work</option>
                  <option value="health">🏥 Health</option>
                  <option value="learning">📚 Learning</option>
                  <option value="social">👥 Social</option>
                  <option value="finance">💰 Finance</option>
                  <option value="creative">🎨 Creative</option>
                </Form.Select>
              </Col>
            </Row>

            <Row className="g-3">
              <Col md={6}>
                <Form.Label className="fw-semibold">Due Date</Form.Label>
                <Form.Control
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  className="rounded-2 py-2"
                />
              </Col>
              <Col md={6}>
                <Form.Label className="fw-semibold">Estimated Time (hours)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="2"
                  value={newTask.estimatedTime}
                  onChange={(e) => setNewTask({...newTask, estimatedTime: e.target.value})}
                  className="rounded-2 py-2"
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="outline-secondary" onClick={() => setShowTaskModal(false)}>
            Cancel
          </Button>
          <Button 
            className="btn-saas btn-saas-primary"
            onClick={addTask}
            disabled={!newTask.text.trim()}
          >
            🚀 Add Task
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .stats-card {
          transition: all 0.3s ease;
        }
        .stats-card:hover {
          transform: translateY(-5px);
        }
        .stats-icon {
          font-size: 2.5rem;
        }
        .quick-action-item {
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .quick-action-item:hover {
          background: var(--bg-secondary);
          transform: translateX(5px);
        }
        .quick-action-icon {
          font-size: 1.5rem;
          margin-right: 1rem;
        }
        .task-item {
          transition: all 0.3s ease;
        }
        .task-item:hover {
          transform: translateX(5px);
          border-left: 4px solid var(--primary) !important;
        }
        .task-title.completed {
          text-decoration: line-through;
          color: var(--text-muted);
        }
        .task-category-icon {
          font-size: 1.5rem;
        }
        .priority-badge {
          font-size: 0.75rem;
        }
        .filter-btn {
          border-radius: 20px;
          font-weight: 600;
        }
        .empty-icon {
          font-size: 4rem;
          opacity: 0.7;
        }
        .tasks-container {
          max-height: 600px;
          overflow-y: auto;
          padding-right: 5px;
        }
        .tasks-container::-webkit-scrollbar {
          width: 6px;
        }
        .tasks-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .tasks-container::-webkit-scrollbar-thumb {
          background: var(--primary-light);
          border-radius: 10px;
        }
      `}</style>
    </Container>
  );
};

export default PremiumPlanner;