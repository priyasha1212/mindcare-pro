import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Modal, Spinner } from 'react-bootstrap';

const Home = ({ user }) => {
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [selectedHelpline, setSelectedHelpline] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFeature, setActiveFeature] = useState(null);

  const featuresRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: '😊',
      title: 'Mood Tracking',
      description: 'Track your emotional journey with beautiful analytics and insights.',
      color: 'primary',
      link: '/mood',
      gradient: 'var(--gradient-primary)'
    },
    {
      icon: '📝',
      title: 'Smart Journal', 
      description: 'AI-powered journaling with emotional analysis and personalized insights.',
      color: 'success',
      link: '/journal',
      gradient: 'var(--gradient-success)'
    },
    {
      icon: '🧘‍♀️',
      title: 'Mindful Breathing',
      description: 'Guided breathing exercises with real-time biofeedback.',
      color: 'info',
      link: '/breathing',
      gradient: 'var(--gradient-accent)'
    },
    {
      icon: '🤖',
      title: 'AI Mental Coach',
      description: '24/7 personalized mental health support and coaching.',
      color: 'secondary', 
      link: '/chatbot',
      gradient: 'var(--gradient-secondary)'
    },
    {
      icon: '📊',
      title: 'Wellness Analytics',
      description: 'Comprehensive insights into your mental health patterns.',
      color: 'warning',
      link: '/analytics',
      gradient: 'var(--gradient-warning)'
    },
    {
      icon: '📅',
      title: 'Productivity Planner',
      description: 'Smart task management with mental wellness integration.',
      color: 'danger',
      link: '/planner',
      gradient: 'var(--gradient-danger)'
    }
  ];

  const emergencyHelplines = [
    {
      name: "Vandrevala Foundation Helpline",
      number: "1860-2662-345",
      description: "24/7 mental health support across India",
      available: "24/7",
      icon: "🇮🇳",
      color: "var(--gradient-primary)"
    },
    {
      name: "iCall Psychosocial Helpline",
      number: "9152987821",
      description: "Professional mental health support",
      available: "Mon-Sat, 10AM-8PM",
      icon: "📞",
      color: "var(--gradient-secondary)"
    },
    {
      name: "COOJ Mental Health Foundation",
      number: "9822562522",
      description: "Goa-based mental health support",
      available: "9AM-5PM",
      icon: "🏥",
      color: "var(--gradient-success)"
    },
    {
      name: "Fortis Stress Helpline",
      number: "8376804102",
      description: "National mental health helpline",
      available: "24/7",
      icon: "🆘",
      color: "var(--gradient-danger)"
    },
    {
      name: "SNEHA Suicide Prevention",
      number: "044-24640050",
      description: "Chennai-based crisis support",
      available: "24/7",
      icon: "💙",
      color: "var(--gradient-accent)"
    },
    {
      name: "Emergency Services",
      number: "112",
      description: "National emergency number",
      available: "24/7",
      icon: "🚨",
      color: "var(--gradient-warning)"
    },
    {
      name: "AASRA Suicide Prevention",
      number: "9820466726",
      description: "24/7 crisis intervention",
      available: "24/7",
      icon: "🤝",
      color: "var(--gradient-info)"
    },
    {
      name: "Connecting NGO",
      number: "9922004305",
      description: "Mental health support and counseling",
      available: "12PM-8PM",
      icon: "💬",
      color: "var(--gradient-primary)"
    }
  ];

  const mentalHealthFacts = [
    {
      statistic: "1 in 7",
      description: "Indians suffer from mental disorders",
      icon: "📊",
      delay: "0s"
    },
    {
      statistic: "56 million",
      description: "Indians suffer from depression",
      icon: "😔",
      delay: "0.1s"
    },
    {
      statistic: "38 million",
      description: "Indians suffer from anxiety disorders",
      icon: "😰",
      delay: "0.2s"
    },
    {
      statistic: "90%",
      description: "of people see improvement with proper support",
      icon: "📈",
      delay: "0.3s"
    }
  ];

  const selfCareTips = [
    {
      tip: "Practice Mindfulness",
      description: "5-10 minutes of daily meditation can reduce stress significantly",
      icon: "🧠",
      duration: "5-10 min"
    },
    {
      tip: "Physical Activity",
      description: "Regular exercise releases endorphins that improve mood",
      icon: "🏃‍♂️",
      duration: "30 min"
    },
    {
      tip: "Sleep Hygiene",
      description: "7-9 hours of quality sleep is crucial for mental health",
      icon: "😴",
      duration: "7-9 hrs"
    },
    {
      tip: "Social Connection",
      description: "Strong relationships are vital for emotional wellbeing",
      icon: "👥",
      duration: "Daily"
    }
  ];

  const handleEmergencyClick = (helpline) => {
    setSelectedHelpline(helpline);
    setShowEmergencyModal(true);
  };

  const handleCallNow = (number) => {
    const cleanNumber = number.replace(/\D/g, '');
    window.location.href = `tel:${cleanNumber}`;
  };

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-grow text-primary mb-4" style={{width: '3rem', height: '3rem'}} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="text-primary mb-2">MindCare</h4>
          <p className="text-muted">Loading your wellness journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Clean Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center min-vh-100">
            <Col lg={6}>
              <div className="hero-content">
                <Badge bg="primary" className="mb-3 px-3 py-2 rounded-pill">
                  🧠 Mental Wellness Platform
                </Badge>
                <h1 className="hero-title">
                  Your Mental Health,
                  <span className="text-gradient"> Compassionately Supported</span>
                </h1>
                <p className="hero-subtitle lead mb-4">
                  MindCare provides evidence-based mental health support, personalized tools, 
                  and a safe space for your wellness journey.
                </p>
                <div className="d-flex gap-3 flex-wrap">
                  <Button 
                    size="lg" 
                    className="btn-saas btn-saas-primary"
                    onClick={() => window.location.href = user ? '/chatbot' : '/register'}
                  >
                    🚀 Start Your Journey
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline-primary"
                    className="btn-saas"
                    onClick={scrollToFeatures}
                  >
                    ✨ Explore Features
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline-primary"
                    className="btn-saas"
                    onClick={() => window.location.href = '/breathing'}
                  >
                    🧘 Quick Relax
                  </Button>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="text-center">
                <div 
                  className="saas-card p-5 mx-auto"
                  style={{
                    maxWidth: '400px'
                  }}
                >
                  <div className="bg-gradient-primary rounded-3 p-4 mb-4">
                    <h4 className="text-white mb-3">Ready to Feel Better?</h4>
                    <p className="text-white-50 mb-0">
                      Begin your journey to better mental health today
                    </p>
                  </div>
                  <Button 
                    className="btn-saas btn-saas-secondary w-100 mb-3"
                    onClick={() => window.location.href = '/chatbot'}
                  >
                    🗣️ Talk to Support Assistant
                  </Button>
                  <small className="text-muted">
                    Professional support • Always available • Free to use
                  </small>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section 
        ref={featuresRef}
        className="py-5"
        style={{background: 'var(--bg-secondary)'}}
      >
        <Container>
          <Row>
            <Col lg={8} className="mx-auto text-center mb-5">
              <h2 className="display-5 fw-bold text-gradient mb-4">
                Mental Wellness Toolkit
              </h2>
              <p className="lead text-muted">
                Comprehensive tools to support your mental health journey
              </p>
            </Col>
          </Row>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="saas-card feature-card fade-in"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  borderColor: activeFeature === index ? feature.color : 'transparent'
                }}
                onClick={() => window.location.href = feature.link}
                onMouseEnter={() => setActiveFeature(index)}
                onMouseLeave={() => setActiveFeature(null)}
              >
                <div className="feature-icon-wrapper">
                  <div 
                    className="feature-icon"
                    style={{background: feature.gradient}}
                  >
                    {feature.icon}
                  </div>
                </div>
                <h4 className="feature-title fw-bold mb-3">{feature.title}</h4>
                <p className="feature-description text-muted mb-3">{feature.description}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <Badge bg="light" text={feature.color} className="px-3 py-2 rounded-pill feature-badge">
                    Explore →
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Mental Health Facts Section */}
      <section className="py-5">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto text-center mb-5">
              <h2 className="display-5 fw-bold text-gradient mb-4">
                Understanding Mental Health in India
              </h2>
              <p className="text-muted">
                Awareness is the first step toward healing and support
              </p>
            </Col>
          </Row>
          <Row className="g-4">
            {mentalHealthFacts.map((fact, index) => (
              <Col md={6} lg={3} key={index}>
                <Card className="saas-card border-0 h-100 fact-card text-center fade-in" style={{animationDelay: fact.delay}}>
                  <Card.Body className="p-4">
                    <div className="fact-icon mb-3" style={{fontSize: '2.5rem'}}>{fact.icon}</div>
                    <h3 className="text-primary fw-bold mb-2">{fact.statistic}</h3>
                    <p className="text-muted mb-0">{fact.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Indian Emergency Helplines */}
      <section className="py-5" style={{background: 'var(--bg-secondary)'}}>
        <Container>
          <Row>
            <Col lg={10} className="mx-auto text-center mb-5">
              <h2 className="display-5 fw-bold text-gradient mb-4">
                🚨 Indian Mental Health Helplines
              </h2>
              <p className="lead text-muted mb-4">
                If you're in crisis or need immediate support, these services are here to help. 
                All services are confidential and many are available 24/7.
              </p>
            </Col>
          </Row>
          <Row className="g-4">
            {emergencyHelplines.map((helpline, index) => (
              <Col md={6} lg={4} key={index}>
                <Card 
                  className="saas-card border-0 h-100 helpline-card emergency-card fade-in"
                  style={{animationDelay: `${index * 0.1}s`}}
                  onClick={() => handleEmergencyClick(helpline)}
                >
                  <Card.Body className="p-4 text-center position-relative">
                    <div 
                      className="helpline-icon mb-3 mx-auto rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: '60px',
                        height: '60px',
                        background: helpline.color,
                        fontSize: '1.5rem'
                      }}
                    >
                      {helpline.icon}
                    </div>
                    <h5 className="fw-bold mb-3">{helpline.name}</h5>
                    <div className="helpline-number h5 fw-bold text-primary mb-2">
                      {helpline.number}
                    </div>
                    <p className="text-muted small mb-3">{helpline.description}</p>
                    <Badge bg={helpline.available === "24/7" ? "success" : "warning"} className="rounded-pill px-3 py-2">
                      {helpline.available}
                    </Badge>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <Row className="mt-4">
            <Col className="text-center">
              <Alert variant="info" className="border-0 rounded-3">
                <strong>💡 Remember:</strong> Reaching out for help is a sign of strength. 
                You don't have to face challenges alone. These services are here to support you.
              </Alert>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Self-Care Tips Section */}
      <section className="py-5">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto text-center mb-5">
              <h2 className="display-5 fw-bold text-gradient mb-4">
                Daily Self-Care Practices
              </h2>
              <p className="text-muted">
                Small, consistent practices can significantly improve mental wellbeing
              </p>
            </Col>
          </Row>
          <Row className="g-4">
            {selfCareTips.map((tip, index) => (
              <Col md={6} lg={3} key={index}>
                <Card className="saas-card border-0 h-100 selfcare-card fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                  <Card.Body className="p-4">
                    <div className="selfcare-icon mb-3" style={{fontSize: '2rem'}}>{tip.icon}</div>
                    <h5 className="fw-bold mb-3">{tip.tip}</h5>
                    <p className="text-muted mb-2">{tip.description}</p>
                    <Badge bg="light" text="dark" className="rounded-pill">
                      {tip.duration}
                    </Badge>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Emergency Contact Modal */}
      <Modal show={showEmergencyModal} onHide={() => setShowEmergencyModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title>🚨 Contact Support Services</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedHelpline && (
            <>
              <div 
                className="mx-auto mb-4 rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: '80px',
                  height: '80px',
                  background: selectedHelpline.color,
                  fontSize: '2rem',
                  color: 'white'
                }}
              >
                {selectedHelpline.icon}
              </div>
              <h4 className="mb-3">{selectedHelpline.name}</h4>
              <div className="h4 text-primary mb-3 fw-bold">{selectedHelpline.number}</div>
              <p className="text-muted mb-3">{selectedHelpline.description}</p>
              <p className="text-success mb-4">
                <strong>Available: {selectedHelpline.available}</strong>
              </p>
              
              <div className="d-flex gap-2 justify-content-center">
                <Button 
                  variant="primary" 
                  size="lg"
                  className="btn-saas"
                  onClick={() => handleCallNow(selectedHelpline.number)}
                >
                  📞 Call Now
                </Button>
                <Button 
                  variant="outline-secondary" 
                  onClick={() => setShowEmergencyModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* CTA Section */}
      <section 
        className="py-5" 
        style={{
          background: 'var(--gradient-primary)', 
          color: 'white'
        }}
      >
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <h2 className="display-5 fw-bold mb-4">
                Begin Your Wellness Journey Today
              </h2>
              <p className="lead mb-4 opacity-90">
                Take the first step towards better mental health with our supportive tools and resources
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Button 
                  size="lg" 
                  className="btn-saas"
                  style={{background: 'white', color: 'var(--primary)', border: 'none'}}
                  onClick={() => window.location.href = user ? '/chatbot' : '/register'}
                >
                  {user ? '🚀 Continue Journey' : '🌟 Get Started'}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline-light"
                  className="btn-saas"
                  onClick={() => window.location.href = '/mood'}
                >
                  📊 Track Your Mood
                </Button>
              </div>
              <small className="opacity-90 mt-3 d-block">
                Free to use • Evidence-based methods • Private and secure
              </small>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;