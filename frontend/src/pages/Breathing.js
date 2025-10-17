import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ProgressBar } from 'react-bootstrap';

const Breathing = () => {
  const [activeExercise, setActiveExercise] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const breathingExercises = [
    {
      id: 1,
      title: "4-7-8 Breathing",
      description: "Calms the nervous system and reduces anxiety",
      duration: "5 minutes",
      difficulty: "Beginner",
      steps: [
        { action: "Breathe in", duration: 4, instruction: "Inhale slowly through your nose" },
        { action: "Hold", duration: 7, instruction: "Hold your breath" },
        { action: "Breathe out", duration: 8, instruction: "Exhale slowly through your mouth" }
      ],
      videoId: "1" // Placeholder for video
    },
    {
      id: 2,
      title: "Box Breathing",
      description: "Improves focus and reduces stress",
      duration: "4 minutes", 
      difficulty: "Beginner",
      steps: [
        { action: "Breathe in", duration: 4, instruction: "Inhale slowly" },
        { action: "Hold", duration: 4, instruction: "Hold your breath" },
        { action: "Breathe out", duration: 4, instruction: "Exhale completely" },
        { action: "Hold", duration: 4, instruction: "Hold empty" }
      ],
      videoId: "2"
    },
    {
      id: 3,
      title: "Deep Belly Breathing",
      description: "Activates relaxation response",
      duration: "3 minutes",
      difficulty: "Beginner", 
      steps: [
        { action: "Breathe in", duration: 5, instruction: "Inhale deeply into your belly" },
        { action: "Breathe out", duration: 5, instruction: "Exhale slowly and completely" }
      ],
      videoId: "3"
    }
  ];

  useEffect(() => {
    let timer;
    if (isRunning && activeExercise) {
      const step = activeExercise.steps[currentStep];
      timer = setTimeout(() => {
        if (currentStep < activeExercise.steps.length - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          setCurrentStep(0); // Restart the cycle
        }
      }, step.duration * 1000);
    }
    return () => clearTimeout(timer);
  }, [isRunning, currentStep, activeExercise]);

  const startExercise = (exercise) => {
    setActiveExercise(exercise);
    setCurrentStep(0);
    setIsRunning(true);
  };

  const stopExercise = () => {
    setIsRunning(false);
    setCurrentStep(0);
  };

  const getProgress = () => {
    if (!activeExercise) return 0;
    return ((currentStep + 1) / activeExercise.steps.length) * 100;
  };

  return (
    <Container className="py-4">
      <Row>
        <Col lg={10} className="mx-auto">
          <h2 className="text-center mb-4 text-gradient">🌬️ Breathing Exercises</h2>
          <p className="text-center text-muted mb-5">
            Calm your mind and reduce stress with guided breathing techniques
          </p>

          {!activeExercise ? (
            <Row className="g-4">
              {breathingExercises.map(exercise => (
                <Col md={6} lg={4} key={exercise.id}>
                  <Card className="saas-card h-100 breathing-card">
                    <Card.Body className="text-center p-4">
                      <div className="breathing-icon mb-3">🌬️</div>
                      <Card.Title>{exercise.title}</Card.Title>
                      <Card.Text className="text-muted">
                        {exercise.description}
                      </Card.Text>
                      <div className="mb-3">
                        <Badge bg="primary" className="me-2">⏱️ {exercise.duration}</Badge>
                        <Badge bg="success">📊 {exercise.difficulty}</Badge>
                      </div>
                      <Button 
                        onClick={() => startExercise(exercise)}
                        className="btn-primary-modern btn-modern w-100"
                      >
                        Start Exercise
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
              
              {/* YouTube Videos Section */}
              <Col xs={12} className="mt-5">
                <Card className="saas-card">
                  <Card.Header className="bg-gradient-info text-white">
                    <h4 className="mb-0">🎥 Guided Breathing Videos</h4>
                  </Card.Header>
                  <Card.Body>
                    <Row className="g-3">
                      <Col md={6}>
                        <div className="ratio ratio-16x9">
                          <iframe 
                            src="https://www.youtube.com/embed/YFSc7Ck0Ao0" 
                            title="4-7-8 Breathing Exercise"
                            allowFullScreen
                          ></iframe>
                        </div>
                        <h6 className="mt-2">4-7-8 Breathing for Anxiety</h6>
                      </Col>
                      <Col md={6}>
                        <div className="ratio ratio-16x9">
                          <iframe 
                            src="https://www.youtube.com/embed/Z2gNa3QBc_4" 
                            title="Box Breathing Technique"
                            allowFullScreen
                          ></iframe>
                        </div>
                        <h6 className="mt-2">Box Breathing for Stress</h6>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          ) : (
            <Card className="saas-card">
              <Card.Header className="bg-gradient-primary text-white d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-0">{activeExercise.title}</h4>
                  <small>{activeExercise.description}</small>
                </div>
                <Button variant="light" onClick={stopExercise}>
                  Stop
                </Button>
              </Card.Header>
              <Card.Body className="text-center p-5">
                {isRunning && (
                  <>
                    <div className="breathing-animation mb-4">
                      <div className="circle" style={{
                        animation: `breathe ${activeExercise.steps[currentStep].duration}s ease-in-out infinite`
                      }}>
                        <span className="action-text h1">
                          {activeExercise.steps[currentStep].action}
                        </span>
                      </div>
                    </div>
                    
                    <h5 className="mb-3">{activeExercise.steps[currentStep].instruction}</h5>
                    <p className="text-muted mb-3">
                      Hold for {activeExercise.steps[currentStep].duration} seconds
                    </p>
                    
                    <ProgressBar 
                      now={getProgress()} 
                      variant="primary" 
                      className="mb-3"
                      style={{height: '8px'}}
                    />
                    
                    <div className="step-indicator">
                      Step {currentStep + 1} of {activeExercise.steps.length}
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      <style jsx>{`
        .breathing-card:hover {
          transform: translateY(-5px);
          transition: transform 0.3s ease;
        }
        
        .breathing-icon {
          font-size: 3rem;
        }
        
        .breathing-animation {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
        }
        
        .circle {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          animation: breathe 4s ease-in-out infinite;
        }
        
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        
        .action-text {
          font-weight: bold;
          margin: 0;
        }
        
        .step-indicator {
          background: #f8f9fa;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          display: inline-block;
        }
      `}</style>
    </Container>
  );
};

export default Breathing;