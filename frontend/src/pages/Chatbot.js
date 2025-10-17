import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';

const Chatbot = ({ user }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your MindCare AI assistant, trained in mental health support. I'm here to listen, provide emotional support, and offer evidence-based coping strategies. How are you feeling today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'greeting'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [error, setError] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const quickActions = [
    "I'm feeling anxious today",
    "I need help with stress management",
    "I'm feeling sad or depressed",
    "Help me relax and calm down",
    "I'm having trouble with motivation",
    "I need someone to talk to",
    "I'm feeling overwhelmed",
    "Help with sleep issues"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const simulateTyping = () => {
    setIsTyping(true);
    return new Promise(resolve => {
      setTimeout(() => {
        setIsTyping(false);
        resolve();
      }, 1000 + Math.random() * 500);
    });
  };

  const getAIResponse = async (userMessage) => {
    try {
      setError('');
      
      const response = await fetch('http://localhost:5001/api/chatbot/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: conversationHistory
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to connect to server');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Unknown error occurred');
      }

      // Update conversation history
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', content: userMessage },
        { role: 'assistant', content: data.response }
      ]);

      return data.response;

    } catch (error) {
      console.error('Error calling chatbot API:', error);
      setError('Connection issue - using enhanced responses');
      
      // Enhanced fallback responses
      return getEnhancedFallbackResponse(userMessage);
    }
  };

  const getEnhancedFallbackResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Crisis detection
    if (/(suicide|kill myself|end it all|want to die|not worth living)/i.test(lowerMessage)) {
      return "I'm very concerned about what you're sharing. Your safety is the most important thing. Please reach out to emergency services or a crisis helpline immediately. In India, you can call Vandrevala Foundation at 1860-2662-345 or the national emergency number 112.";
    }

    // Enhanced response matching
    if (/(hello|hi|hey|greetings)/i.test(lowerMessage)) {
      const greetings = [
        "Hello! I'm MindCare AI. I'm here to support your mental wellness journey with empathy and evidence-based strategies. What would you like to talk about today?",
        "Hi there! I'm your mental health companion. Whether you need coping strategies, emotional support, or just someone to listen without judgment, I'm here for you.",
        "Welcome! I'm trained in mental health support and here to help you navigate your feelings and build resilience. How can I support you right now?"
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    if (/(anxious|anxiety|nervous|worried|panic|overthink)/i.test(lowerMessage)) {
      const anxietyResponses = [
        "I understand anxiety can feel overwhelming, like you're carrying a heavy weight. Let's try the 5-4-3-2-1 grounding technique together: Notice 5 things you can see around you, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste. This helps anchor you in the present moment when worries about the future feel too big.",
        "When anxiety strikes, remember it's your body's way of trying to protect you. The 4-7-8 breathing technique can help calm your nervous system: Breathe in through your nose for 4 seconds, hold for 7 seconds, exhale through your mouth for 8 seconds. Repeat this 3-4 times. Notice how your body begins to relax with each exhale.",
        "Anxiety often comes from worrying about what might happen. Try this perspective shift: Ask yourself 'What's actually happening right now?' rather than 'What might happen?' Focus on the present reality, not future possibilities. What's one small, kind thing you can do for yourself in this moment?"
      ];
      return anxietyResponses[Math.floor(Math.random() * anxietyResponses.length)];
    }
    
    if (/(depress|sad|down|hopeless|empty|miserable|blue)/i.test(lowerMessage)) {
      const depressionResponses = [
        "I hear you're going through a difficult time. Depression can make everything feel heavy and overwhelming, like you're moving through thick fog. Remember that your feelings are valid, and even small steps like brushing your teeth, drinking water, or opening a window are significant accomplishments worth acknowledging.",
        "When depression makes motivation feel impossible, try the 'five-minute rule': Commit to an activity for just five minutes. Often, starting is the hardest part. If after five minutes you want to stop, that's okay - you've already accomplished something. If you continue, that's a bonus. This approach respects your energy levels while building momentum.",
        "You're not alone in this struggle. Many people experience depression, and it's okay to not be okay. The fact that you're reaching out shows incredible strength. Consider reaching out to trusted friends, family, or mental health professionals for additional support. Sometimes sharing the load makes it easier to carry."
      ];
      return depressionResponses[Math.floor(Math.random() * depressionResponses.length)];
    }
    
    if (/(stress|overwhelm|pressure|burnout|too much)/i.test(lowerMessage)) {
      const stressResponses = [
        "Stress can really accumulate and affect both mind and body. Let's try progressive muscle relaxation: Tense each muscle group for 5 seconds, then release completely. Start from your toes and work upward - feet, calves, thighs, glutes, stomach, hands, arms, shoulders, neck, and face. Notice the difference between tension and relaxation in each area.",
        "When stress builds up, sometimes externalizing it can help. Try the 'circle of control' exercise: Draw two circles. In the inner circle, list things you can control (your reactions, self-care, boundaries). In the outer circle, list things you can't control (others' actions, past events, certain outcomes). Focus your energy on the inner circle where you have influence.",
        "Remember the three R's of stress management: Recognize your stress signals early (irritability, fatigue, tension), Reduce exposure to stressors when possible (set boundaries, delegate tasks), and build Resilience through consistent self-care practices (sleep, nutrition, movement, connection)."
      ];
      return stressResponses[Math.floor(Math.random() * depressionResponses.length)];
    }

    if (/(angry|mad|furious|rage|annoyed|frustrated)/i.test(lowerMessage)) {
      const angerResponses = [
        "Anger is a natural emotion that signals something important to us feels threatened or unfair. When you feel anger rising, try the 'time out' method - remove yourself from the situation for 10-15 minutes to cool down before responding. This space can help you respond rather than react.",
        "Physical release can help with anger's energy. Try squeezing a stress ball, punching a pillow, or doing vigorous exercise like running or jumping jacks. The goal is to release the physical energy of anger in a safe way that doesn't harm yourself or others.",
        "Use 'I feel' statements to express anger constructively: 'I feel angry when... because... I would prefer...' This helps communicate your needs without blaming others and increases the chance of being understood."
      ];
      return angerResponses[Math.floor(Math.random() * angerResponses.length)];
    }

    if (/(lonely|alone|isolated|no friends|no one cares)/i.test(lowerMessage)) {
      const lonelinessResponses = [
        "Feeling lonely can be incredibly painful, like there's an empty space where connection should be. Remember that loneliness is a common human experience, and it doesn't mean you're unlikeable or unworthy of connection. Many people feel lonely even when surrounded by others.",
        "Start with small social connections that feel manageable: Smile at a stranger, make brief eye contact with someone, send a simple 'thinking of you' text to an old friend, or leave a kind comment online. Small interactions can build momentum for larger connections.",
        "Consider joining online communities related to your interests - book clubs, gaming groups, hobby forums. Sometimes digital connections can be comfortable stepping stones to in-person relationships. What activities or topics genuinely interest you?"
      ];
      return lonelinessResponses[Math.floor(Math.random() * lonelinessResponses.length)];
    }

    if (/(can't sleep|insomnia|tired|exhausted|sleep problem|awake)/i.test(lowerMessage)) {
      const sleepResponses = [
        "Sleep difficulties often accompany emotional struggles. Try establishing a 'wind down' routine 60 minutes before bed: dim lights, no screens, gentle stretching, reading a physical book, or listening to calm music. This signals to your brain that it's time to rest.",
        "If you can't sleep, instead of staying in bed frustrated, try the 15-minute rule: If you're not asleep after 15-20 minutes, get up, go to another room, do something calming in dim light (read, listen to soft music), then return to bed when you feel sleepy. This helps associate your bed with sleep rather than frustration.",
        "Practice the 4-7-8 breathing in bed: Inhale 4 seconds, hold 7, exhale 8. This triggers the relaxation response and can help quiet racing thoughts. Imagine your thoughts as clouds passing by - acknowledge them without holding on."
      ];
      return sleepResponses[Math.floor(Math.random() * sleepResponses.length)];
    }

    // Default empathetic responses
    const defaultResponses = [
      "Thank you for sharing that with me. It takes courage to talk about these things. How has this been affecting your daily life and relationships?",
      "I appreciate you opening up. Mental health is a journey with both challenges and moments of growth. What kind of support would be most helpful for you right now - practical strategies, emotional validation, or something else?",
      "That sounds really difficult to navigate. Remember that reaching out for support is a sign of strength and self-awareness. What's one small thing that usually helps you feel even slightly better or more grounded?",
      "I'm listening carefully to what you're sharing. Sometimes just expressing our thoughts and feelings out loud can provide some relief and clarity. Would you like to explore this further together?",
      "Thank you for trusting me with this. Your feelings are valid and important. What would be most supportive for you in this moment - practical coping strategies, emotional support, or just having someone listen with care?",
      "I hear the pain and challenge in what you're sharing. It's okay to not have all the answers right now. What do you need most in this moment to feel supported and understood?",
      "You're dealing with a lot right now. Remember to be gentle with yourself - healing and growth aren't linear processes. What would feel like a kind, manageable step forward from here?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setConversationStarted(true);

    await simulateTyping();
    const botResponse = await getAIResponse(inputMessage);
    
    const botMessage = {
      id: Date.now() + 1,
      text: botResponse,
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
  };

  const handleQuickAction = async (action) => {
    const userMessage = {
      id: Date.now(),
      text: action,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setConversationStarted(true);

    await simulateTyping();
    const botResponse = await getAIResponse(action);
    
    const botMessage = {
      id: Date.now() + 1,
      text: botResponse,
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
  };

  const handleEmergency = () => {
    window.location.href = '/emergency';
  };

  const handleRelax = () => {
    window.location.href = '/breathing';
  };

  const handleCopyMessage = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="chatbot-container">
      <Container>
        <Row className="justify-content-center">
          <Col lg={9} xl={8}>
            <div className="chatbot-window">
              {/* Premium Chatbot Header */}
              <div className="chatbot-header">
                <div className="chatbot-avatar">
                  💭
                </div>
                <div className="flex-grow-1">
                  <h5 className="mb-1">MindCare AI Assistant</h5>
                  <small className="text-muted">
                    {isTyping ? 'Thinking...' : 'Trained in mental health support • Always confidential'}
                  </small>
                </div>
                <div className="d-flex gap-2">
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    className="btn-saas"
                    onClick={handleRelax}
                  >
                    🧘 Breathing
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    className="btn-saas"
                    onClick={handleEmergency}
                  >
                    🚨 Emergency
                  </Button>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="warning" className="m-3 mb-0 rounded-lg">
                  <small>{error}</small>
                </Alert>
              )}

              {/* Chat Messages */}
              <div className="chatbot-messages">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message ${message.sender === 'user' ? 'message-user' : 'message-bot'}`}
                  >
                    <div className="message-text">{message.text}</div>
                    
                    {/* Message Actions */}
                    <div className="message-actions">
                      {message.sender === 'bot' && (
                        <button
                          className="message-action-btn"
                          onClick={() => handleCopyMessage(message.text)}
                          title="Copy message"
                        >
                          📋 Copy
                        </button>
                      )}
                    </div>
                    
                    <div 
                      className="message-time small text-muted mt-2"
                      style={{
                        textAlign: message.sender === 'user' ? 'right' : 'left'
                      }}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="message-typing">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <span className="ms-2 small text-muted">AI thinking...</span>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              {!conversationStarted && (
                <div className="quick-actions">
                  <small className="w-100 text-muted mb-2">Quick ways to start:</small>
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      className="quick-action-btn"
                      onClick={() => handleQuickAction(action)}
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Area */}
              <form onSubmit={handleSendMessage} className="chatbot-input-container">
                <textarea
                  ref={inputRef}
                  className="chatbot-input"
                  placeholder="Share what's on your mind... (I'm here to listen and support you)"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={isTyping}
                  rows="1"
                  onInput={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                  }}
                />
                <button
                  type="submit"
                  className="chatbot-send-btn"
                  disabled={!inputMessage.trim() || isTyping}
                  title="Send message"
                >
                  {isTyping ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <span style={{ fontSize: '1.2rem' }}>➤</span>
                  )}
                </button>
              </form>

              {/* Enhanced Safety Notice */}
              <div className="p-3 border-top bg-light">
                <small className="text-muted">
                  <strong>🔒 Your privacy matters:</strong> Conversations are encrypted and confidential. 
                  <strong> ⚠️ Important:</strong> I'm an AI assistant for support, not a replacement for professional care. 
                  If you're in crisis, please use the emergency button or contact healthcare providers immediately.
                </small>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Chatbot;