import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup, Badge, ProgressBar } from 'react-bootstrap';

const EnhancedPlanner = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ text: '', priority: 'medium', category: 'personal' });

  useEffect(() => {
    const savedTasks = localStorage.getItem(`planner_${user?.id}`);
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
      createdAt: new Date().toISOString()
    };
    
    const updatedTasks = [task, ...tasks];
    setTasks(updatedTasks);
    localStorage.setItem(`planner_${user?.id}`, JSON.stringify(updatedTasks));
    setNewTask({ text: '', priority: 'medium', category: 'personal' });
  };

  const toggleTask = (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem(`planner_${user?.id}`, JSON.stringify(updatedTasks));
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem(`planner_${user?.id}`, JSON.stringify(updatedTasks));
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
      social: '👥'
    };
    return icons[category];
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <div className="text-center mb-5">
            <h1 className="display-5 fw-bold text-gradient mb-3">📅 Daily Planner</h1>
            <p className="lead text-muted">Organize your tasks and boost your productivity</p>
          </div>

          <Card className="saas-card border-0 shadow-lg">
            <Card.Header className="bg-gradient-primary text-white border-0 py-3">
              <h4 className="mb-0">Add New Task</h4>
            </Card.Header>
            <Card.Body className="p-4">
              {/* Progress Overview */}
              {totalTasks > 0 && (
                <div className="mb-4 p-3 bg-light rounded-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-semibold">Today's Progress</span>
                    <strong className="text-primary">{completionRate}%</strong>
                  </div>
                  <ProgressBar now={completionRate} variant="success" className="mb-2" style={{height: '8px'}} />
                  <small className="text-muted">
                    {completedTasks} of {totalTasks} tasks completed
                  </small>
                </div>
              )}

              {/* Add Task Form */}
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Task Description</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="What do you need to accomplish today?"
                    value={newTask.text}
                    onChange={(e) => setNewTask({...newTask, text: e.target.value})}
                    className="rounded-2 py-2"
                  />
                </Form.Group>

                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Priority</Form.Label>
                    <Form.Select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                      className="rounded-2"
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
                      className="rounded-2"
                    >
                      <option value="personal">👤 Personal</option>
                      <option value="work">💼 Work</option>
                      <option value="health">🏥 Health</option>
                      <option value="learning">📚 Learning</option>
                      <option value="social">👥 Social</option>
                    </Form.Select>
                  </Col>
                </Row>

                <Button 
                  onClick={addTask}
                  className="btn-primary-modern btn-modern w-100 py-2"
                  disabled={!newTask.text.trim()}
                >
                  ➕ Add Task
                </Button>
              </Form>
            </Card.Body>
          </Card>

          {/* Tasks List */}
          {tasks.length > 0 && (
            <Card className="saas-card border-0 shadow-lg mt-4">
              <Card.Header className="bg-light border-0 py-3">
                <h5 className="mb-0">Your Tasks ({tasks.length})</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <ListGroup variant="flush">
                  {tasks.map(task => (
                    <ListGroup.Item key={task.id} className="border-0 px-4 py-3">
                      <div className="d-flex align-items-center">
                        <Form.Check
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTask(task.id)}
                          className="me-3 flex-shrink-0"
                        />
                        
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center mb-1">
                            <span className="me-2">{getCategoryIcon(task.category)}</span>
                            <span className={task.completed ? 'text-decoration-line-through text-muted' : 'fw-semibold'}>
                              {task.text}
                            </span>
                          </div>
                          <div className="d-flex gap-2 align-items-center">
                            <Badge bg={getPriorityColor(task.priority)} className="text-capitalize">
                              {task.priority} priority
                            </Badge>
                            <small className="text-muted">
                              Added: {new Date(task.createdAt).toLocaleDateString()}
                            </small>
                          </div>
                        </div>

                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => deleteTask(task.id)}
                          className="flex-shrink-0"
                        >
                          🗑️
                        </Button>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          )}

          {tasks.length === 0 && (
            <Card className="saas-card border-0 text-center py-5 mt-4">
              <Card.Body>
                <div className="fs-1 mb-3">📝</div>
                <h5>No tasks yet</h5>
                <p className="text-muted mb-4">
                  Add your first task to get started with planning your day
                </p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default EnhancedPlanner;