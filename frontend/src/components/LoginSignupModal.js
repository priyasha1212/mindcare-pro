import React, { useState } from 'react';
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

const LoginSignupModal = ({ show, setShow, setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await axios.post(`http://localhost:5000${endpoint}`, formData);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        setShow(false);
        setFormData({ full_name: '', email: '', password: '' });
        setError('');
      } else {
        setError(response.data.error || 'Something went wrong');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ full_name: '', email: '', password: '' });
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} centered size="lg">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="w-100 text-center">
          <h2 className="text-gradient mb-0">
            {isLogin ? 'Welcome Back' : 'Join MindCare Pro'}
          </h2>
          <p className="text-muted mt-2">
            {isLogin ? 'Sign in to continue your mental health journey' : 'Start your journey to better mental health'}
          </p>
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="pt-0">
        <div className="glass p-4 rounded-3 mb-4">
          <div className="d-flex mb-4 bg-light rounded-2 p-1">
            <button
              className={`flex-fill btn ${isLogin ? 'btn-primary' : 'btn-light'} rounded-1`}
              onClick={() => setIsLogin(true)}
            >
              Sign In
            </button>
            <button
              className={`flex-fill btn ${!isLogin ? 'btn-primary' : 'btn-light'} rounded-1`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <Alert variant="danger" className="border-0 rounded-2">
              <strong>⚠️ {error}</strong>
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            {!isLogin && (
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="rounded-2 py-2"
                />
              </Form.Group>
            )}
            
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="rounded-2 py-2"
              />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                minLength="6"
                className="rounded-2 py-2"
              />
              {!isLogin && (
                <Form.Text className="text-muted">
                  Password must be at least 6 characters long
                </Form.Text>
              )}
            </Form.Group>
            
            <Button 
              type="submit" 
              className="w-100 btn-modern btn-primary-modern py-2" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                isLogin ? '🔐 Sign In' : '🚀 Create Account'
              )}
            </Button>
          </Form>

          <div className="text-center mt-4">
            <button 
              type="button"
              className="btn btn-link text-decoration-none"
              onClick={switchMode}
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>

        <div className="text-center">
          <small className="text-muted">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </small>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LoginSignupModal;