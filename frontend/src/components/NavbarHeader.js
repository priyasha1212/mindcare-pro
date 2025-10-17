import React from 'react';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';

const NavbarHeader = ({ onLoginClick, user, onLogout }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm border-bottom">
      <Container>
        <Navbar.Brand href="/" className="fw-bold text-primary">
          🧠 MindCare Pro
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/" className="fw-semibold">Home</Nav.Link>
            <Nav.Link href="/mood" className="fw-semibold">Mood Tracker</Nav.Link>
            <Nav.Link href="/planner" className="fw-semibold">Planner</Nav.Link>
            <Nav.Link href="/breathing" className="fw-semibold">Breathing</Nav.Link>
            <Nav.Link href="/chatbot" className="fw-semibold">AI Assistant</Nav.Link>
          </Nav>
          
          <Nav>
            {user ? (
              <Dropdown align="end">
                <Dropdown.Toggle 
                  variant="outline-primary" 
                  id="dropdown-basic"
                  className="d-flex align-items-center gap-2"
                >
                  👤 {user.full_name || user.email}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="/profile">Profile</Dropdown.Item>
                  <Dropdown.Item href="/settings">Settings</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Button 
                variant="primary" 
                onClick={onLoginClick}
                className="rounded-pill px-4"
              >
                Login / Sign Up
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarHeader;