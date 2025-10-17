import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup, Badge } from 'react-bootstrap';

const EnhancedMoodTracker = ({ user }) => {
  const [mood, setMood] = useState(6);
  const [note, setNote] = useState('');
  const [entries, setEntries] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);

  const moodOptions = [
    { value: 1, emoji: '😢', label: 'Very Low', color: 'danger' },
    { value: 2, emoji: '😞', label: 'Low', color: 'warning' },
    { value: 3, emoji: '😐', label: 'Neutral', color: 'secondary' },
    { value: 4, emoji: '😊', label: 'Good', color: 'info' },
    { value: 5, emoji: '😁', label: 'Great', color: 'primary' },
    { value: 6, emoji: '🤩', label: 'Excellent', color: 'success' }
  ];

  useEffect(() => {
    const savedEntries = localStorage.getItem(`mood_entries_${user?.id}`);
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, [user]);

  const addMoodEntry = () => {
    if (!note.trim()) {
      alert('Please add a note about your mood');
      return;
    }

    const entry = {
      id: Date.now(),
      mood: selectedMood || mood,
      note: note.trim(),
      date: new Date().toISOString(),
      moodData: moodOptions.find(m => m.value === (selectedMood || mood))
    };

    const updatedEntries = [entry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem(`mood_entries_${user?.id}`, JSON.stringify(updatedEntries));
    setNote('');
    setSelectedMood(null);
  };

  const getMoodStats = () => {
    if (entries.length === 0) return { average: 0, trend: 'neutral' };
    
    const avg = entries.reduce((sum, entry) => sum + entry.mood, 0) / entries.length;
    const today = new Date().toDateString();
    const todayEntries = entries.filter(entry => new Date(entry.date).toDateString() === today);
    
    return {
      average: avg.toFixed(1),
      todayCount: todayEntries.length,
      total: entries.length
    };
  };

  const stats = getMoodStats();

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <div className="text-center mb-5">
            <h1 className="display-5 fw-bold text-gradient mb-3">😊 Mood Tracker</h1>
            <p className="lead text-muted">Track your emotional journey and understand your patterns</p>
          </div>

          {/* Stats Overview */}
          <Row className="g-4 mb-5">
            <Col md={4}>
              <Card className="saas-card border-0 text-center h-100">
                <Card.Body className="p-4">
                  <div className="display-6 text-primary mb-2">{stats.average}</div>
                  <Card.Title>Average Mood</Card.Title>
                  <small className="text-muted">Out of 6</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="saas-card border-0 text-center h-100">
                <Card.Body className="p-4">
                  <div className="display-6 text-success mb-2">{stats.todayCount}</div>
                  <Card.Title>Today's Entries</Card.Title>
                  <small className="text-muted">Mood checks today</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="saas-card border-0 text-center h-100">
                <Card.Body className="p-4">
                  <div className="display-6 text-info mb-2">{stats.total}</div>
                  <Card.Title>Total Entries</Card.Title>
                  <small className="text-muted">All time entries</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-4">
            {/* Add Mood Entry */}
            <Col lg={6}>
              <Card className="saas-card border-0 shadow-lg">
                <Card.Header className="bg-gradient-primary text-white border-0 py-3">
                  <h4 className="mb-0">How are you feeling?</h4>
                </Card.Header>
                <Card.Body className="p-4">
                  <Form>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold mb-3">Select your mood</Form.Label>
                      <div className="d-flex flex-wrap gap-2 justify-content-between">
                        {moodOptions.map(option => (
                          <Button
                            key={option.value}
                            variant={selectedMood === option.value ? option.color : 'outline-' + option.color}
                            className="flex-fill mood-option-btn"
                            onClick={() => setSelectedMood(option.value)}
                            style={{minWidth: '80px'}}
                          >
                            <div className="fs-4">{option.emoji}</div>
                            <small>{option.label}</small>
                          </Button>
                        ))}
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">Add a note (optional)</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="What's influencing your mood today? Any specific thoughts or events?"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="rounded-2"
                      />
                    </Form.Group>

                    <Button 
                      onClick={addMoodEntry}
                      className="btn-primary-modern btn-modern w-100 py-2"
                      disabled={!selectedMood}
                    >
                      💾 Save Mood Entry
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            {/* Recent Entries */}
            <Col lg={6}>
              <Card className="saas-card border-0 shadow-lg h-100">
                <Card.Header className="bg-light border-0 py-3">
                  <h5 className="mb-0">Recent Mood Entries</h5>
                </Card.Header>
                <Card.Body className="p-0">
                  {entries.length === 0 ? (
                    <div className="text-center py-5">
                      <div className="fs-1 mb-3">📊</div>
                      <h6>No entries yet</h6>
                      <p className="text-muted small">Your mood entries will appear here</p>
                    </div>
                  ) : (
                    <ListGroup variant="flush">
                      {entries.slice(0, 5).map(entry => (
                        <ListGroup.Item key={entry.id} className="border-0 px-4 py-3">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <Badge bg={entry.moodData.color} className="fs-6">
                              {entry.moodData.emoji} {entry.moodData.label}
                            </Badge>
                            <small className="text-muted">
                              {new Date(entry.date).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </small>
                          </div>
                          {entry.note && (
                            <p className="text-muted mb-0 small">{entry.note}</p>
                          )}
                          <small className="text-muted d-block mt-1">
                            {new Date(entry.date).toLocaleDateString()}
                          </small>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* All Entries */}
          {entries.length > 5 && (
            <Card className="saas-card border-0 shadow-lg mt-4">
              <Card.Header className="bg-light border-0 py-3">
                <h5 className="mb-0">All Mood Entries</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <ListGroup variant="flush">
                  {entries.slice(5).map(entry => (
                    <ListGroup.Item key={entry.id} className="border-0 px-4 py-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <Badge bg={entry.moodData.color} className="fs-6">
                          {entry.moodData.emoji} {entry.moodData.label}
                        </Badge>
                        <small className="text-muted">
                          {new Date(entry.date).toLocaleDateString()}
                        </small>
                      </div>
                      {entry.note && (
                        <p className="text-muted mb-0">{entry.note}</p>
                      )}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      <style jsx>{`
        .mood-option-btn {
          transition: all 0.3s ease;
        }
        .mood-option-btn:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </Container>
  );
};

export default EnhancedMoodTracker;