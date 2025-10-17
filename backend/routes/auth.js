const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db_manager');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'mindcare-pro-super-secret-key-2024';

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('Register request:', req.body);
    const { full_name, email, password } = req.body;
    
    if (!full_name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'All fields are required' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters'
      });
    }

    // Check if user exists
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          error: 'Database error'
        });
      }

      if (user) {
        return res.status(400).json({
          success: false,
          error: 'User already exists with this email'
        });
      }

      // Hash password and create user
      const hashedPassword = await bcrypt.hash(password, 12);
      
      db.run(
        'INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)',
        [full_name, email, hashedPassword],
        function(err) {
          if (err) {
            console.error('Insert error:', err);
            return res.status(500).json({
              success: false,
              error: 'Failed to create user'
            });
          }
          
          const token = jwt.sign(
            { userId: this.lastID, email }, 
            JWT_SECRET,
            { expiresIn: '7d' }
          );
          
          res.json({ 
            success: true,
            message: 'User registered successfully',
            token,
            user: { 
              id: this.lastID, 
              full_name, 
              email 
            }
          });
        }
      );
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('Login request:', req.body);
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Email and password are required' 
      });
    }

    db.get(
      'SELECT * FROM users WHERE email = ?',
      [email],
      async (err, user) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ 
            success: false,
            error: 'Database error' 
          });
        }
        
        if (!user) {
          return res.status(400).json({ 
            success: false,
            error: 'Invalid email or password' 
          });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          return res.status(400).json({ 
            success: false,
            error: 'Invalid email or password' 
          });
        }

        const token = jwt.sign(
          { userId: user.id, email }, 
          JWT_SECRET,
          { expiresIn: '7d' }
        );
        
        res.json({
          success: true,
          message: 'Login successful',
          token,
          user: { 
            id: user.id, 
            full_name: user.full_name, 
            email: user.email 
          }
        });
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// Verify token
router.get('/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false,
      error: 'No token provided' 
    });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    db.get(
      'SELECT id, full_name, email FROM users WHERE id = ?',
      [decoded.userId],
      (err, user) => {
        if (err || !user) {
          return res.status(401).json({ 
            success: false,
            error: 'Invalid token' 
          });
        }
        res.json({ 
          success: true,
          user 
        });
      }
    );
  } catch (error) {
    res.status(401).json({ 
      success: false,
      error: 'Invalid token' 
    });
  }
});

module.exports = router;