import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';

const PremiumChatbot = ({ user }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "Hello! I'm your AI Mental Wellness Coach. I'm here to provide professional mental health support, evidence-based strategies, and compassionate guidance. How can I assist you today? 🌟",
      timestamp: new Date(),
      suggestions: [
        "I'm feeling anxious and overwhelmed",
        "Help me manage stress better",
        "I've been feeling sad lately",
        "I need motivation and focus"
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const mentalHealthResources = [
    {
      title: "Breathing Exercise",
      description: "Calm your nervous system",
      icon: "🌬️",
      action: () => window.location.href = '/breathing'
    },
    {
      title: "Mood Check-in",
      description: "Track how you're feeling",
      icon: "😊",
      action: () => window.location.href = '/mood'
    },
    {
      title: "Journal Entry",
      description: "Express your thoughts",
      icon: "📝",
      action: () => window.location.href = '/journal'
    },
    {
      title: "Quick Relax",
      description: "2-minute relaxation",
      icon: "🧘‍♀️",
      action: () => handleQuickRelax()
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuickRelax = () => {
    const relaxMessage = {
      id: Date.now(),
      type: 'bot',
      text: "Let's take a moment to breathe together. Close your eyes if comfortable, and take three deep breaths with me... 🌿",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, relaxMessage]);
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    handleSendMessage(suggestion);
  };

  const handleResourceClick = (resource) => {
    resource.action();
  };

  const handleSendMessage = async (text = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: text.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(async () => {
      try {
        // Your actual API call would go here
        const response = await fetch('http://localhost:5000/api/chatbot/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ message: text.trim() })
        });

        const data = await response.json();
        
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          text: data.response || "I understand how you're feeling. It takes courage to reach out. Let's work through this together. Would you like to try a breathing exercise or perhaps journal about what's on your mind?",
          timestamp: new Date(),
          suggestions: [
            "Tell me more about this",
            "How can I cope with this?",
            "Suggest a technique",
            "I need immediate help"
          ]
        };

        setMessages(prev => [...prev, botMessage]);
      } catch (error) {
        const errorMessage = {
          id: Date.now() + 1,
          type: 'bot',
          text: "I'm here to listen and support you. It seems there's a connection issue, but I want you to know that your feelings are valid. Consider trying one of our relaxation tools while I get back online.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
        setIsTyping(false);
      }
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="premium-chatbot-container">
      <Container fluid>
        <Row className="justify-content-center">
          <Col xl={10}>
            <div className="chatbot-layout">
              {/* Sidebar */}
              <div className="chatbot-sidebar">
                <Card className="saas-card border-0 h-100">
                  <Card.Header className="bg-gradient-primary text-white border-0">
                    <h5 className="mb-0">🛠️ Wellness Tools</h5>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <div className="resources-list">
                      {mentalHealthResources.map((resource, index) => (
                        <div
                          key={index}
                          className="resource-item"
                          onClick={resource.action}
                        >
                          <div className="resource-icon">{resource.icon}</div>
                          <div className="resource-content">
                            <h6 className="mb-1">{resource.title}</h6>
                            <small className="text-muted">{resource.description}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="p-3 border-top">
                      <h6 className="mb-3">🚨 Emergency Contacts</h6>
                      <div className="emergency-contacts">
                        <div className="emergency-item">
                          <strong>Suicide Prevention:</strong>
                          <span className="text-danger">988</span>
                        </div>
                        <div className="emergency-item">
                          <strong>Crisis Text Line:</strong>
                          <span>Text HOME to 741741</span>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>

              {/* Main Chat Area */}
              <div className="chatbot-main">
                <Card className="saas-card border-0 h-100">
                  {/* Chat Header */}
                  <Card.Header className="chat-header bg-light border-0">
                    <div className="d-flex align-items-center">
                      <div className="chat-avatar">🤖</div>
                      <div className="ms-3">
                        <h5 className="mb-1">AI Mental Wellness Coach</h5>
                        <div className="d-flex align-items-center">
                          <Badge bg="success" className="me-2">Online</Badge>
                          <small className="text-muted">Always here to listen</small>
                        </div>
                      </div>
                    </div>
                    {user && (
                      <Badge bg="primary" className="user-badge">
                        👋 Hello, {user.full_name}
                      </Badge>
                    )}
                  </Card.Header>

                  {/* Messages Area */}
                  <Card.Body className="chat-messages-container p-0">
                    <div className="chat-messages">
                      {messages.map((message) => (
                        <div key={message.id} className={`message ${message.type}`}>
                          <div className="message-avatar">
                            {message.type === 'bot' ? '🤖' : '👤'}
                          </div>
                          <div className="message-content">
                            <div className="message-text">{message.text}</div>
                            <div className="message-time">
                              {formatTime(message.timestamp)}
                            </div>
                            
                            {/* Suggestions */}
                            {message.suggestions && (
                              <div className="suggestions-container">
                                {message.suggestions.map((suggestion, idx) => (
                                  <Button
                                    key={idx}
                                    variant="outline-primary"
                                    size="sm"
                                    className="suggestion-btn"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                  >
                                    {suggestion}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {/* Typing Indicator */}
                      {isTyping && (
                        <div className="message bot">
                          <div className="message-avatar">🤖</div>
                          <div className="message-content">
                            <div className="typing-indicator">
                              <span>AI Coach is thinking</span>
                              <div className="typing-dots">
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div ref={messagesEndRef} />
                    </div>
                  </Card.Body>

                  {/* Input Area */}
                  <Card.Footer className="chat-input-container border-0">
                    {!user ? (
                      <Alert variant="warning" className="mb-0 text-center">
                        <strong>🔐 Login Required</strong> - Please login to chat with your AI Mental Wellness Coach
                      </Alert>
                    ) : (
                      <>
                        <div className="input-group">
                          <textarea
                            className="chat-input"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Share what's on your mind... (Press Enter to send)"
                            rows="2"
                            disabled={isLoading}
                          />
                          <Button
                            className="send-btn btn-saas btn-saas-primary"
                            onClick={() => handleSendMessage()}
                            disabled={isLoading || !input.trim()}
                          >
                            {isLoading ? (
                              <div className="spinner-border spinner-border-sm" />
                            ) : (
                              '➤'
                            )}
                          </Button>
                        </div>
                        <div className="chat-footer">
                          <small className="text-muted">
                            💡 Your conversations are private and secure. In emergencies, 
                            contact <strong>988</strong> for immediate help.
                          </small>
                        </div>
                      </>
                    )}
                  </Card.Footer>
                </Card>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .premium-chatbot-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem 0;
        }
        
        .chatbot-layout {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 1.5rem;
          height: 85vh;
        }
        
        .chatbot-sidebar {
          height: 100%;
        }
        
        .chatbot-main {
          height: 100%;
        }
        
        .resources-list {
          padding: 1rem 0;
        }
        
        .resource-item {
          display: flex;
          align-items: center;
          padding: 1rem 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border-left: 4px solid transparent;
        }
        
        .resource-item:hover {
          background: var(--bg-secondary);
          border-left-color: var(--primary);
          transform: translateX(5px);
        }
        
        .resource-icon {
          font-size: 1.5rem;
          margin-right: 1rem;
          width: 40px;
          text-align: center;
        }
        
        .emergency-contacts {
          font-size: 0.9rem;
        }
        
        .emergency-item {
          display: flex;
          justify-content: between;
          margin-bottom: 0.5rem;
          padding: 0.5rem;
          background: var(--bg-secondary);
          border-radius: var(--radius);
        }
        
        .emergency-item strong {
          flex: 1;
        }
        
        .chat-header {
          display: flex;
          justify-content: between;
          align-items: center;
          padding: 1.5rem;
        }
        
        .chat-avatar {
          font-size: 2rem;
          width: 50px;
          height: 50px;
          background: var(--gradient-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .user-badge {
          font-size: 0.8rem;
        }
        
        .chat-messages-container {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .message {
          display: flex;
          gap: 1rem;
          max-width: 80%;
        }
        
        .message.user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }
        
        .message.bot {
          align-self: flex-start;
        }
        
        .message-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          flex-shrink: 0;
        }
        
        .message.user .message-avatar {
          background: var(--gradient-primary);
          color: white;
        }
        
        .message.bot .message-avatar {
          background: var(--gradient-secondary);
          color: white;
        }
        
        .message-content {
          flex: 1;
        }
        
        .message-text {
          background: var(--bg-secondary);
          padding: 1rem 1.5rem;
          border-radius: var(--radius-xl);
          border-top-left-radius: 0;
          line-height: 1.6;
        }
        
        .message.user .message-text {
          background: var(--gradient-primary);
          color: white;
          border-top-left-radius: var(--radius-xl);
          border-top-right-radius: 0;
        }
        
        .message-time {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 0.5rem;
          text-align: right;
        }
        
        .message.user .message-time {
          text-align: left;
        }
        
        .suggestions-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        
        .suggestion-btn {
          border-radius: 20px;
          font-size: 0.8rem;
        }
        
        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted);
          font-style: italic;
        }
        
        .typing-dots {
          display: flex;
          gap: 0.25rem;
        }
        
        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--text-muted);
          animation: typing 1.4s infinite ease-in-out;
        }
        
        .dot:nth-child(1) { animation-delay: -0.32s; }
        .dot:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes typing {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        
        .chat-input-container {
          padding: 1.5rem;
        }
        
        .input-group {
          display: flex;
          gap: 1rem;
          align-items: flex-end;
        }
        
        .chat-input {
          flex: 1;
          border: 2px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1rem 1.5rem;
          resize: none;
          font-family: inherit;
          transition: all 0.3s ease;
        }
        
        .chat-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
        
        .send-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .chat-footer {
          margin-top: 1rem;
          text-align: center;
        }
        
        @media (max-width: 1200px) {
          .chatbot-layout {
            grid-template-columns: 1fr;
            height: auto;
          }
          
          .chatbot-sidebar {
            height: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default PremiumChatbot;