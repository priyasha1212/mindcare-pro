import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';

// Import components
import Home from './pages/Home';
import Chatbot from './pages/Chatbot';

// Import enhanced components
import EnhancedBreathing from './components/EnhancedBreathing';
import EnhancedJournal from './components/EnhancedJournal';
import EnhancedPlanner from './components/EnhancedPlanner';
import EnhancedMoodTracker from './components/EnhancedMoodTracker';
import ProgressAnalytics from './components/ProgressAnalytics';

// Import layout components
import NavbarHeader from './components/NavbarHeader';
import LoginSignupModal from './components/LoginSignupModal';

import './styles.css';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Component Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container py-5 text-center">
          <div className="alert alert-danger">
            <h4>Something went wrong</h4>
            <p>This component failed to load. Please try refreshing the page.</p>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('http://localhost:5000/api/auth/verify', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setUser(response.data.user);
        }
      }
    } catch (error) {
      console.log('Auth check failed');
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} />
          <p className="mt-3 text-muted">Loading MindCare Pro...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <NavbarHeader 
        onLoginClick={() => setShowModal(true)} 
        user={user} 
        onLogout={handleLogout}
      />
      <LoginSignupModal 
        show={showModal} 
        setShow={setShowModal} 
        setUser={setUser} 
      />
      
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/mood" element={
          <ErrorBoundary>
            <EnhancedMoodTracker user={user} />
          </ErrorBoundary>
        } />
        <Route path="/planner" element={
          <ErrorBoundary>
            <EnhancedPlanner user={user} />
          </ErrorBoundary>
        } />
        <Route path="/breathing" element={
          <ErrorBoundary>
            <EnhancedBreathing />
          </ErrorBoundary>
        } />
        <Route path="/chatbot" element={
          <ErrorBoundary>
            <Chatbot user={user} />
          </ErrorBoundary>
        } />
        <Route path="/journal" element={
          <ErrorBoundary>
            <EnhancedJournal user={user} />
          </ErrorBoundary>
        } />
        <Route path="/analytics" element={
          <ErrorBoundary>
            <ProgressAnalytics user={user} />
          </ErrorBoundary>
        } />
      </Routes>
    </Router>
  );
}

export default App;