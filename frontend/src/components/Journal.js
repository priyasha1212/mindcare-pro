import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup, Badge } from 'react-bootstrap';

const Journal = ({ user }) => {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({ title: '', content: '', mood: 5 });

  useEffect(() => {
    const savedEntries = localStorage.getItem(`journal_${user?.id}`);
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, [user]);

  const addEntry = () => {
    if (!newEntry.title || !newEntry.content) return;
    
    const entry = {
      id: Date.now(),
      ...newEntry,
      date: new Date().toISOString(),
      moodEmoji: getMoodEmoji(newEntry.mood)
    };
    
    const updatedEntries = [entry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem(`journal_${user?.id}`, JSON.stringify(updatedEntries));
    setNewEntry({ title: '', content: '', mood: 5 });
  };

  const getMoodEmoji = (mood) => {
    const emojis = ['😢', '😞', '😐', '😊', '😁', '🤩'];
    return emojis[Math.min(mood - 1, 5)];
  };

  const getMoodColor = (mood) => {
    const colors = ['danger', 'warning', 'secondary', 'info', 'primary', 'success'];
    return colors[Math.min(mood - 1, 5)];
  };

  return (
    <Container className="py-4">
      <Row>
        <Col lg={8} className="mx-auto">
          <Card className="saas-card shadow-lg">
            <Card.Header className="bg-gradient-primary text-white">
              <h3 className="mb-0">📝 Personal Journal</h3>
              <small>Express your thoughts and track your emotional journey</small>
            </Card.Header>
            <Card.Body className="p-4">
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="What's on your mind today?"
                    value={newEntry.title}
                    onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>How are you feeling?</Form.Label>
                  <div className="d-flex align-items-center gap-3">
                    <span>😢</span>
                    <Form.Range
                      min="1"
                      max="6"
                      value={newEntry.mood}
                      onChange={(e) => setNewEntry({...newEntry, mood: parseInt(e.target.value)})}
                    />
                    <span>🤩</span>
                    <Badge bg={getMoodColor(newEntry.mood)} className="fs-6">
                      {getMoodEmoji(newEntry.mood)} {newEntry.mood}/6
                    </Badge>
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Your Thoughts</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Write about your day, feelings, or anything you'd like to remember..."
                    value={newEntry.content}
                    onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                  />
                </Form.Group>

                <Button 
                  onClick={addEntry}
                  className="btn-primary-modern btn-modern"
                  disabled={!newEntry.title || !newEntry.content}
                >
                  💾 Save Entry
                </Button>
              </Form>

              <hr className="my-4" />

              <h5>Your Journal Entries</h5>
              {entries.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <p>No entries yet. Start writing your first journal entry!</p>
                </div>
              ) : (
                <ListGroup variant="flush">
                  {entries.map(entry => (
                    <ListGroup.Item key={entry.id} className="px-0">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="mb-0">{entry.title}</h6>
                        <Badge bg={getMoodColor(entry.mood)}>
                          {entry.moodEmoji}
                        </Badge>
                      </div>
                      <p className="text-muted mb-2">{entry.content}</p>
                      <small className="text-muted">
                        {new Date(entry.date).toLocaleDateString()} • 
                        {new Date(entry.date).toLocaleTimeString()}
                      </small>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Journal;