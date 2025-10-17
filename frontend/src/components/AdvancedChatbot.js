import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const AdvancedChatbot = ({ user }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "Hello! I'm your MindCare AI assistant. I'm here to provide mental health support, coping strategies, and a listening ear. How are you feeling today?",
      timestamp: new Date(),
      loading: false
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const quickReplies = [
    "I'm feeling anxious today",
    "Help me manage stress",
    "I need motivation",
    "I'm feeling depressed",
    "Teach me a breathing exercise",
    "I can't sleep well",
    "How to handle panic attacks?",
    "I need self-care ideas"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleQuickReply = async (text) => {
    setInput('');
    await handleSendMessage(text);
  };

  const handleSendMessage = async (text = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: text.trim(),
      timestamp: new Date(),
      loading: false
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Add typing indicator
    const typingMessage = {
      id: Date.now() + 1,
      type: 'bot',
      text: '',
      timestamp: new Date(),
      loading: true
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      const response = await axios.post('http://localhost:5000/api/chatbot/message', {
        message: text.trim()
      });

      if (response.data.success) {
        // Remove typing indicator and add actual response
        setMessages(prev => 
          prev.filter(msg => !msg.loading).concat({
            id: Date.now() + 2,
            type: 'bot',
            text: response.data.response,
            timestamp: new Date(),
            loading: false
          })
        );
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => 
        prev.filter(msg => !msg.loading).concat({
          id: Date.now() + 2,
          type: 'bot',
          text: "I apologize, but I'm having trouble responding right now. Please try again in a moment.",
          timestamp: new Date(),
          loading: false
        })
      );
    } finally {
      setIsLoading(false);
    }
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
    <div className="chatbot-container fade-in">
      <div className="chatbot-header">
        <h1 className="chatbot-title">MindCare AI Assistant</h1>
        <p className="chatbot-subtitle">
          Your 24/7 mental health companion • Powered by advanced AI
        </p>
      </div>

      <div className="saas-card chat-window">
        <div className="chat-header">
          <div className="chat-header-icon">🧠</div>
          <div>
            <h3 className="mb-1">MindCare AI</h3>
            <small>Online • Always here to listen</small>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}`}>
              {message.loading ? (
                <div className="message-typing">
                  <span>MindCare AI is thinking</span>
                  <div className="typing-dots">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="message-text">{message.text}</div>
                  <div className="message-time">
                    {formatTime(message.timestamp)}
                  </div>
                </>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && (
          <div className="quick-replies-container p-3 border-bottom">
            <div className="quick-replies-label text-sm text-muted mb-2">
              Quick suggestions:
            </div>
            <div className="quick-replies">
              {quickReplies.map((reply, index) => (
                <div
                  key={index}
                  className="quick-reply"
                  onClick={() => handleQuickReply(reply)}
                >
                  {reply}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="chat-input-container">
          <div className="chat-input-wrapper">
            <textarea
              ref={textareaRef}
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here... (Press Enter to send)"
              rows="1"
              disabled={isLoading}
            />
            <button
              className="send-button"
              onClick={() => handleSendMessage()}
              disabled={isLoading || !input.trim()}
            >
              <span>Send</span>
              <span>➤</span>
            </button>
          </div>
          <div className="text-xs text-muted mt-2">
            MindCare AI provides mental health support but is not a substitute for professional help. 
            In emergencies, contact crisis helplines.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedChatbot;