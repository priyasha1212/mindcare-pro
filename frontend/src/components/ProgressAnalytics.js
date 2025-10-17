import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ProgressBar, Badge } from 'react-bootstrap';

const ProgressAnalytics = ({ user }) => {
  const [analytics, setAnalytics] = useState({
    moodTrend: [7, 6, 8, 5, 7, 9, 8],
    consistency: 85,
    wellnessScore: 76,
    goals: [
      { id: 1, text: "Practice mindfulness daily", completed: true },
      { id: 2, text: "Exercise 3 times a week", completed: false },
      { id: 3, text: "Journal every day", completed: true }
    ]
  });

  const getMoodColor = (mood) => {
    if (mood >= 8) return 'success';
    if (mood >= 6) return 'info';
    if (mood >= 4) return 'warning';
    return 'danger';
  };

  const getMoodLabel = (mood) => {
    if (mood >= 8) return 'Excellent';
    if (mood >= 6) return 'Good';
    if (mood >= 4) return 'Okay';
    return 'Needs attention';
  };

  return (
    <Container className="py-4">
      <Row>
        <Col lg={10} className="mx-auto">
          <h2 className="text-center mb-4 text-gradient">📊 Your Progress Analytics</h2>
          
          <Row className="g-4 mb-4">
            <Col md={4}>
              <Card className="saas-card text-center h-100">
                <Card.Body>
                  <div className="display-4 text-primary mb-2">76%</div>
                  <Card.Title>Wellness Score</Card.Title>
                  <ProgressBar now={76} variant="primary" className="mb-2" />
                  <small className="text-muted">Overall mental wellness</small>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card className="saas-card text-center h-100">
                <Card.Body>
                  <div className="display-4 text-success mb-2">85%</div>
                  <Card.Title>Consistency</Card.Title>
                  <ProgressBar now={85} variant="success" className="mb-2" />
                  <small className="text-muted">Daily check-ins</small>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card className="saas-card text-center h-100">
                <Card.Body>
                  <div className="display-4 text-info mb-2">+12%</div>
                  <Card.Title>Improvement</Card.Title>
                  <ProgressBar now={12} variant="info" className="mb-2" />
                  <small className="text-muted">Last 30 days</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-4">
            <Col lg={6}>
              <Card className="saas-card h-100">
                <Card.Header>
                  <h5 className="mb-0">📈 Mood Trend (Last 7 Days)</h5>
                </Card.Header>
                <Card.Body>
                  {analytics.moodTrend.map((mood, index) => (
                    <div key={index} className="d-flex align-items-center mb-3">
                      <div className="flex-shrink-0 me-3" style={{width: '80px'}}>
                        <small>Day {index + 1}</small>
                      </div>
                      <ProgressBar 
                        now={(mood/10)*100} 
                        variant={getMoodColor(mood)}
                        style={{flex: 1}}
                        className="me-3"
                      />
                      <Badge bg={getMoodColor(mood)}>
                        {mood}/10
                      </Badge>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>

            <Col lg={6}>
              <Card className="saas-card h-100">
                <Card.Header>
                  <h5 className="mb-0">🎯 Wellness Goals</h5>
                </Card.Header>
                <Card.Body>
                  {analytics.goals.map(goal => (
                    <div key={goal.id} className="d-flex align-items-center mb-3 p-2 border rounded">
                      <span className={`me-3 ${goal.completed ? 'text-success' : 'text-muted'}`}>
                        {goal.completed ? '✅' : '⭕'}
                      </span>
                      <span className={goal.completed ? 'text-decoration-line-through text-muted' : ''}>
                        {goal.text}
                      </span>
                    </div>
                  ))}
                  
                  <div className="mt-4 p-3 bg-light rounded">
                    <h6>💡 Tips for Improvement</h6>
                    <ul className="mb-0">
                      <li>Practice gratitude daily</li>
                      <li>Get 7-8 hours of sleep</li>
                      <li>Stay hydrated and eat well</li>
                      <li>Take short breaks during work</li>
                    </ul>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default ProgressAnalytics;