import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup, Badge, Modal } from 'react-bootstrap';

const EnhancedJournal = ({ user }) => {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({ 
    title: '', 
    content: '', 
    mood: 5, 
    tags: [] 
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    const savedEntries = localStorage.getItem(`journal_${user?.id}`);
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, [user]);

  const moodEmojis = ['😢', '😞', '😐', '😊', '😁', '🤩'];
  const moodColors = ['danger', 'warning', 'secondary', 'info', 'primary', 'success'];
  const moodLabels = ['Very Low', 'Low', 'Neutral', 'Good', 'Great', 'Excellent'];

  const commonTags = ['Anxiety', 'Stress', 'Happiness', 'Gratitude', 'Goals', 'Reflection', 'Dreams', 'Challenges'];

  const addEntry = () => {
    if (!newEntry.title || !newEntry.content) return;
    
    const entry = {
      id: Date.now(),
      ...newEntry,
      date: new Date().toISOString(),
      moodEmoji: moodEmojis[newEntry.mood - 1],
      moodLabel: moodLabels[newEntry.mood - 1]
    };
    
    const updatedEntries = [entry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem(`journal_${user?.id}`, JSON.stringify(updatedEntries));
    setNewEntry({ title: '', content: '', mood: 5, tags: [] });
    setShowModal(false);
  };

  const toggleTag = (tag) => {
    setNewEntry(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const viewEntry = (entry) => {
    setSelectedEntry(entry);
  };

  const closeEntry = () => {
    setSelectedEntry(null);
  };

  const getMoodColor = (mood) => moodColors[Math.min(mood - 1, 5)];

  // Calculate journaling stats
  const totalEntries = entries.length;
  const averageMood = entries.length > 0 
    ? (entries.reduce((sum, entry) => sum + entry.mood, 0) / entries.length).toFixed(1)
    : 0;
  const mostUsedTag = entries.length > 0
    ? [...new Set(entries.flatMap(entry => entry.tags))]
        .map(tag => ({
          tag,
          count: entries.filter(entry => entry.tags.includes(tag)).length
        }))
        .sort((a, b) => b.count - a.count)[0]?.tag
    : 'No tags yet';

  return (
    <Container className="py-4">
      <Row>
        <Col lg={10} className="mx-auto">
          {/* Header with Stats */}
          <div className="text-center mb-5">
            <h1 className="display-5 fw-bold text-gradient mb-3">📝 Personal Journal</h1>
            <p className="lead text-muted mb-4">
              Your safe space for thoughts, feelings, and self-reflection
            </p>
            
            <Row className="g-4 justify-content-center">
              <Col md={3}>
                <Card className="saas-card border-0 text-center">
                  <Card.Body>
                    <div className="display-6 text-primary mb-2">{totalEntries}</div>
                    <Card.Title className="small">Total Entries</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="saas-card border-0 text-center">
                  <Card.Body>
                    <div className="display-6 text-success mb-2">{averageMood}</div>
                    <Card.Title className="small">Avg Mood</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="saas-card border-0 text-center">
                  <Card.Body>
                    <div className="display-6 text-info mb-2">{mostUsedTag}</div>
                    <Card.Title className="small">Common Theme</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>

          <Row className="g-4">
            {/* New Entry Card */}
            <Col lg={4}>
              <Card className="saas-card border-0 h-100">
                <Card.Body className="d-flex flex-column">
                  <div className="text-center mb-4">
                    <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                         style={{width: '80px', height: '80px'}}>
                      <span className="fs-2">✨</span>
                    </div>
                    <h5>New Journal Entry</h5>
                    <p className="text-muted small">
                      Capture your thoughts, feelings, and experiences
                    </p>
                  </div>
                  
                  <Button 
                    onClick={() => setShowModal(true)}
                    className="btn-primary-modern btn-modern mt-auto"
                  >
                    ✍️ Write New Entry
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            {/* Journal Entries */}
            <Col lg={8}>
              {entries.length === 0 ? (
                <Card className="saas-card border-0 text-center py-5">
                  <Card.Body>
                    <div className="fs-1 mb-3">📖</div>
                    <h5>No entries yet</h5>
                    <p className="text-muted mb-4">
                      Start your journaling journey by writing your first entry
                    </p>
                    <Button 
                      onClick={() => setShowModal(true)}
                      className="btn-primary-modern btn-modern"
                    >
                      Write First Entry
                    </Button>
                  </Card.Body>
                </Card>
              ) : (
                <div className="entries-container">
                  {entries.map(entry => (
                    <Card key={entry.id} className="saas-card border-0 mb-3 journal-entry">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="mb-0 flex-grow-1 me-3">{entry.title}</h6>
                          <Badge bg={getMoodColor(entry.mood)} className="fs-6">
                            {entry.moodEmoji} {entry.moodLabel}
                          </Badge>
                        </div>
                        
                        <p className="text-muted mb-2 journal-preview">
                          {entry.content.length > 150 
                            ? `${entry.content.substring(0, 150)}...` 
                            : entry.content
                          }
                        </p>
                        
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex gap-1 flex-wrap">
                            {entry.tags.map(tag => (
                              <Badge key={tag} bg="outline-secondary" text="dark" className="small">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="d-flex gap-2">
                            <small className="text-muted">
                              {new Date(entry.date).toLocaleDateString()}
                            </small>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => viewEntry(entry)}
                            >
                              Read
                            </Button>
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

      {/* New Entry Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title>✍️ New Journal Entry</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="What's on your mind today?"
                value={newEntry.title}
                onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                className="rounded-2"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>How are you feeling?</Form.Label>
              <div className="d-flex align-items-center gap-3">
                <span className="text-muted">😢</span>
                <Form.Range
                  min="1"
                  max="6"
                  value={newEntry.mood}
                  onChange={(e) => setNewEntry({...newEntry, mood: parseInt(e.target.value)})}
                  className="flex-grow-1"
                />
                <span className="text-muted">🤩</span>
                <Badge bg={getMoodColor(newEntry.mood)} className="fs-6 px-3">
                  {moodEmojis[newEntry.mood - 1]} {moodLabels[newEntry.mood - 1]}
                </Badge>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tags</Form.Label>
              <div className="d-flex flex-wrap gap-2">
                {commonTags.map(tag => (
                  <Badge
                    key={tag}
                    bg={newEntry.tags.includes(tag) ? "primary" : "outline-secondary"}
                    text={newEntry.tags.includes(tag) ? "white" : "dark"}
                    className="cursor-pointer px-3 py-2"
                    onClick={() => toggleTag(tag)}
                    style={{cursor: 'pointer'}}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Your Thoughts</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                placeholder="Write freely about your day, feelings, dreams, challenges, or anything you'd like to remember..."
                value={newEntry.content}
                onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                className="rounded-2"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button 
            onClick={addEntry}
            className="btn-primary-modern"
            disabled={!newEntry.title || !newEntry.content}
          >
            💾 Save Entry
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View Entry Modal */}
      <Modal show={!!selectedEntry} onHide={closeEntry} size="lg" centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title>{selectedEntry?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEntry && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Badge bg={getMoodColor(selectedEntry.mood)} className="fs-6">
                  {selectedEntry.moodEmoji} {selectedEntry.moodLabel}
                </Badge>
                <small className="text-muted">
                  {new Date(selectedEntry.date).toLocaleString()}
                </small>
              </div>
              
              <div className="mb-3">
                {selectedEntry.tags.map(tag => (
                  <Badge key={tag} bg="outline-secondary" text="dark" className="me-1">
                    #{tag}
                  </Badge>
                ))}
              </div>
              
              <div className="journal-content">
                {selectedEntry.content.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-3">{paragraph}</p>
                ))}
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>

      <style jsx>{`
        .journal-entry {
          transition: all 0.3s ease;
        }
        .journal-entry:hover {
          transform: translateX(5px);
          box-shadow: 0 5px 20px rgba(0,0,0,0.1) !important;
        }
        .journal-preview {
          line-height: 1.6;
        }
        .journal-content {
          line-height: 1.8;
          font-size: 1.1em;
        }
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </Container>
  );
};

export default EnhancedJournal;