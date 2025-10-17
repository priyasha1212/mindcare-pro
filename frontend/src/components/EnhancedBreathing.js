import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ProgressBar, Badge } from 'react-bootstrap';

const EnhancedBreathing = () => {
  const [activeExercise, setActiveExercise] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  const breathingExercises = [
    {
      id: 1,
      title: "4-7-8 Breathing",
      description: "Calms anxiety and prepares body for sleep",
      duration: "5 minutes",
      difficulty: "Beginner",
      benefits: ["Reduces anxiety", "Improves sleep", "Calms nervous system"],
      steps: [
        { action: "Breathe In", duration: 4, instruction: "Inhale slowly through your nose", emoji: "👃" },
        { action: "Hold", duration: 7, instruction: "Hold your breath comfortably", emoji: "⏳" },
        { action: "Breathe Out", duration: 8, instruction: "Exhale completely through mouth", emoji: "😮‍💨" }
      ],
      color: "primary"
    },
    {
      id: 2,
      title: "Box Breathing",
      description: "Enhances focus and reduces stress",
      duration: "4 minutes", 
      difficulty: "Beginner",
      benefits: ["Improves concentration", "Reduces stress", "Balances nervous system"],
      steps: [
        { action: "Breathe In", duration: 4, instruction: "Inhale deeply and slowly", emoji: "🌬️" },
        { action: "Hold", duration: 4, instruction: "Hold breath gently", emoji: "⏸️" },
        { action: "Breathe Out", duration: 4, instruction: "Exhale completely", emoji: "💨" },
        { action: "Hold", duration: 4, instruction: "Hold with empty lungs", emoji: "🔄" }
      ],
      color: "info"
    },
    {
      id: 3,
      title: "Deep Belly Breathing",
      description: "Activates relaxation response instantly",
      duration: "3 minutes",
      difficulty: "Beginner", 
      benefits: ["Instant calm", "Reduces tension", "Improves oxygen flow"],
      steps: [
        { action: "Breathe In", duration: 5, instruction: "Inhale deeply into your belly", emoji: "🫁" },
        { action: "Breathe Out", duration: 5, instruction: "Exhale slowly and completely", emoji: "🌪️" }
      ],
      color: "success"
    },
    {
      id: 4,
      title: "Alternate Nostril Breathing",
      description: "Balances left and right brain hemispheres",
      duration: "6 minutes",
      difficulty: "Intermediate",
      benefits: ["Mental clarity", "Emotional balance", "Reduces anxiety"],
      steps: [
        { action: "Close Right Nostril", duration: 4, instruction: "Inhale through left nostril", emoji: "👈" },
        { action: "Switch", duration: 4, instruction: "Hold breath briefly", emoji: "🔄" },
        { action: "Close Left Nostril", duration: 4, instruction: "Exhale through right nostril", emoji: "👉" },
        { action: "Inhale Right", duration: 4, instruction: "Inhale through right nostril", emoji: "👉" },
        { action: "Switch", duration: 4, instruction: "Hold breath briefly", emoji: "🔄" },
        { action: "Exhale Left", duration: 4, instruction: "Exhale through left nostril", emoji: "👈" }
      ],
      color: "warning"
    }
  ];

  useEffect(() => {
    let timer;
    if (isRunning && activeExercise) {
      const step = activeExercise.steps[currentStep];
      setTimeLeft(step.duration);
      
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (currentStep < activeExercise.steps.length - 1) {
              setCurrentStep(currentStep + 1);
            } else {
              setCurrentStep(0); // Restart the cycle
            }
            return step.duration;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, currentStep, activeExercise]);

  const startExercise = (exercise) => {
    setActiveExercise(exercise);
    setCurrentStep(0);
    setIsRunning(true);
  };

  const stopExercise = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setTimeLeft(0);
  };

  const getProgress = () => {
    if (!activeExercise) return 0;
    return ((currentStep + 1) / activeExercise.steps.length) * 100;
  };

  const getCircleSize = () => {
    if (!activeExercise) return 150;
    const step = activeExercise.steps[currentStep];
    if (step.action.includes("In")) return 200; // Inhale - expand
    if (step.action.includes("Out")) return 100; // Exhale - contract
    return 150; // Hold - neutral
  };

  return (
    <Container className="py-4">
      <Row>
        <Col lg={10} className="mx-auto">
          <div className="text-center mb-5">
            <h1 className="display-5 fw-bold text-gradient mb-3">🌬️ Breathing Exercises</h1>
            <p className="lead text-muted">
              Calm your mind, reduce stress, and find your center with guided breathing techniques
            </p>
          </div>

          {!activeExercise ? (
            <>
              <Row className="g-4 mb-5">
                {breathingExercises.map(exercise => (
                  <Col md={6} key={exercise.id}>
                    <Card className="saas-card h-100 breathing-card border-0">
                      <Card.Body className="p-4">
                        <div className="d-flex align-items-start mb-3">
                          <div className={`bg-${exercise.color} bg-opacity-10 rounded p-3 me-3`}>
                            <span className="fs-2">{exercise.emoji || '🌬️'}</span>
                          </div>
                          <div className="flex-grow-1">
                            <Card.Title className="h5 mb-2">{exercise.title}</Card.Title>
                            <Card.Text className="text-muted small mb-2">
                              {exercise.description}
                            </Card.Text>
                            <div className="d-flex gap-2 flex-wrap">
                              <Badge bg="outline-primary" className="text-primary">
                                ⏱️ {exercise.duration}
                              </Badge>
                              <Badge bg="outline-success" className="text-success">
                                📊 {exercise.difficulty}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <h6 className="small fw-semibold mb-2">Benefits:</h6>
                          <div className="d-flex flex-wrap gap-1">
                            {exercise.benefits.map((benefit, idx) => (
                              <Badge key={idx} bg="light" text="dark" className="small">
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Button 
                          onClick={() => startExercise(exercise)}
                          className={`btn-${exercise.color} w-100 btn-modern`}
                        >
                          🎯 Start Exercise
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* Guided Videos Section */}
              <Card className="saas-card border-0">
                <Card.Header className="bg-gradient-info text-white border-0">
                  <h4 className="mb-0">🎥 Guided Breathing Videos</h4>
                </Card.Header>
                <Card.Body className="p-4">
                  <Row className="g-4">
                    <Col md={6}>
                      <div className="ratio ratio-16x9 rounded overflow-hidden">
                        <iframe 
                          src="https://www.youtube.com/embed/YFSc7Ck0Ao0" 
                          title="4-7-8 Breathing Exercise"
                          allowFullScreen
                          style={{border: 'none'}}
                        ></iframe>
                      </div>
                      <div className="mt-3">
                        <h6 className="fw-semibold">4-7-8 Breathing for Instant Calm</h6>
                        <p className="text-muted small mb-0">Dr. Andrew Weil's technique for anxiety relief</p>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="ratio ratio-16x9 rounded overflow-hidden">
                        <iframe 
                          src="https://www.youtube.com/embed/Z2gNa3QBc_4" 
                          title="Box Breathing Technique"
                          allowFullScreen
                          style={{border: 'none'}}
                        ></iframe>
                      </div>
                      <div className="mt-3">
                        <h6 className="fw-semibold">Box Breathing for Stress & Focus</h6>
                        <p className="text-muted small mb-0">Navy SEAL technique for mental clarity</p>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </>
          ) : (
            <Card className="saas-card border-0">
              <Card.Header className={`bg-gradient-${activeExercise.color} text-white border-0`}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="mb-0">{activeExercise.title}</h4>
                    <small>{activeExercise.description}</small>
                  </div>
                  <Button variant="light" onClick={stopExercise} className="btn-modern">
                    ⏹️ Stop
                  </Button>
                </div>
              </Card.Header>
              
              <Card.Body className="text-center p-5">
                {isRunning && (
                  <>
                    {/* Breathing Animation */}
                    <div className="breathing-animation mb-4">
                      <div 
                        className="circle mx-auto"
                        style={{
                          width: getCircleSize(),
                          height: getCircleSize(),
                          transition: 'all 1s ease-in-out',
                          background: `linear-gradient(135deg, var(--bs-${activeExercise.color}) 0%, var(--bs-${activeExercise.color}-dark) 100%)`
                        }}
                      >
                        <div className="circle-content text-white">
                          <div className="action-emoji fs-1">
                            {activeExercise.steps[currentStep].emoji}
                          </div>
                          <div className="action-text h4 mb-1">
                            {activeExercise.steps[currentStep].action}
                          </div>
                          <div className="time-left display-6 fw-bold">
                            {timeLeft}s
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Instructions */}
                    <div className="instruction-section mb-4">
                      <h5 className="text-dark mb-2">
                        {activeExercise.steps[currentStep].instruction}
                      </h5>
                      <p className="text-muted mb-3">
                        Hold for {activeExercise.steps[currentStep].duration} seconds
                      </p>
                    </div>
                    
                    {/* Progress */}
                    <div className="progress-section">
                      <ProgressBar 
                        now={getProgress()} 
                        variant={activeExercise.color}
                        className="mb-3"
                        style={{height: '10px', borderRadius: '10px'}}
                      />
                      <div className="step-indicator bg-light rounded-pill px-3 py-1 d-inline-block">
                        <small className="text-muted fw-semibold">
                          Step {currentStep + 1} of {activeExercise.steps.length} • {activeExercise.duration}
                        </small>
                      </div>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      <style jsx>{`
        .breathing-card {
          transition: all 0.3s ease;
        }
        .breathing-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important;
        }
        
        .circle {
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          transition: all 1s ease-in-out;
        }
        
        .circle-content {
          text-align: center;
        }
        
        .action-emoji {
          margin-bottom: 0.5rem;
        }
        
        .instruction-section {
          max-width: 400px;
          margin: 0 auto;
        }
        
        .progress-section {
          max-width: 300px;
          margin: 0 auto;
        }
      `}</style>
    </Container>
  );
};

export default EnhancedBreathing;