require('dotenv').config();

console.log('🔍 Checking environment variables...');
console.log('OPENAI_API_KEY present:', !!process.env.OPENAI_API_KEY);
console.log('JWT_SECRET present:', !!process.env.JWT_SECRET);
console.log('PORT:', process.env.PORT);

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize OpenAI with safe fallback
let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-actual-openai-api-key-here') {
  try {
    const { OpenAI } = require('openai');
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    console.log('✅ OpenAI initialized successfully');
  } catch (error) {
    console.log('❌ OpenAI initialization failed:', error.message);
    openai = null;
  }
} else {
  console.log('⚠️ OpenAI API key not configured - using fallback responses');
}

const JWT_SECRET = process.env.JWT_SECRET || 'mindcare-pro-default-secret';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database setup
const db = new sqlite3.Database('./mindcare.db', (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('✅ Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS chat_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      message TEXT,
      response TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS mood_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      mood INTEGER,
      note TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);
  });
}

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('🔍 Registration attempt:', req.body);
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
        return res.status(500).json({ success: false, error: 'Database error' });
      }

      if (user) {
        return res.status(400).json({ success: false, error: 'User already exists with this email' });
      }

      // Hash password and create user
      const hashedPassword = await bcrypt.hash(password, 12);
      
      db.run(
        'INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)',
        [full_name, email, hashedPassword],
        function(err) {
          if (err) {
            console.error('Insert error:', err);
            return res.status(500).json({ success: false, error: 'Failed to create user account' });
          }
          
          const token = jwt.sign(
            { userId: this.lastID, email }, 
            JWT_SECRET,
            { expiresIn: '7d' }
          );
          
          console.log('✅ User registered successfully:', this.lastID);
          res.json({ 
            success: true,
            message: 'Registration successful! Welcome to MindCare Pro!',
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
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('🔍 Login attempt:', req.body);
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    db.get(
      'SELECT * FROM users WHERE email = ?',
      [email],
      async (err, user) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ success: false, error: 'Database error' });
        }
        
        if (!user) {
          return res.status(400).json({ success: false, error: 'Invalid email or password' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          return res.status(400).json({ success: false, error: 'Invalid email or password' });
        }

        const token = jwt.sign(
          { userId: user.id, email }, 
          JWT_SECRET,
          { expiresIn: '7d' }
        );
        
        console.log('✅ User logged in successfully:', user.id);
        res.json({
          success: true,
          message: 'Login successful! Welcome back!',
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
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Verify token endpoint
app.get('/api/auth/verify', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Invalid or expired token' });
    }

    db.get(
      'SELECT id, full_name, email FROM users WHERE id = ?',
      [user.userId],
      (err, userData) => {
        if (err || !userData) {
          return res.status(401).json({ success: false, error: 'User not found' });
        }
        res.json({ success: true, user: userData });
      }
    );
  });
});

// Fallback responses for chatbot
// Enhanced fallback responses
const fallbackResponses = {
  anxiety: [
    "I understand you're feeling anxious. Let's try the 5-4-3-2-1 grounding technique together: \n\n🔹 **5 things you can see** (look around)\n🔹 **4 things you can touch** (feel textures)\n🔹 **3 things you can hear** (listen carefully)\n🔹 **2 things you can smell** (breathe deeply)\n🔹 **1 thing you can taste** (focus on taste)\n\nThis brings you back to the present moment. 🌟",
    
    "When anxiety strikes, try the **4-7-8 breathing technique**:\n\n🌬️ Inhale through your nose for 4 seconds\n⏳ Hold your breath for 7 seconds\n😮‍💨 Exhale through your mouth for 8 seconds\n\nRepeat this 4 times. This activates your body's relaxation response and calms your nervous system. 💫",
    
    "Anxiety often comes from worrying about the future. Let's practice **mindful grounding**:\n\n✨ Place both feet flat on the floor\n✨ Feel the connection with the ground\n✨ Notice your breath moving in and out\n✨ Name one safe thing in this moment\n\nYou are safe right here, right now. 🛡️"
  ],
  depression: [
    "I hear you're going through a difficult time. Depression can make everything feel heavy. Remember:\n\n🌱 Your feelings are valid\n🌱 This moment won't last forever\n🌱 Even small steps are victories\n🌱 You are stronger than you feel\n\nTry the **'five-minute rule'** today: just commit to one small activity for five minutes. 🕐",
    
    "When depression makes motivation hard, try **behavioral activation**:\n\n📝 Break tasks into tiny steps\n🎯 Focus on just starting, not finishing\n💖 Be gentle with yourself\n🌈 Celebrate small wins\n\nWhat's one tiny thing you could do in the next 10 minutes? 🌟",
    
    "You're not alone in this struggle. Many people experience depression, and it's okay to not be okay. \n\n**Self-care ideas for today**:\n\n☀️ Open a window for fresh air\n💧 Drink a glass of water\n📞 Text one trusted person\n🌿 Step outside for 2 minutes\n\nYou deserve care and support. 🤝"
  ],
  stress: [
    "Stress can really take a toll. Let's try **progressive muscle relaxation**:\n\n💪 Tense each muscle group for 5 seconds\n😌 Release completely and notice the difference\n🦶 Start from your toes up to your head\n🌊 Feel the wave of relaxation\n\nThis helps release physical tension. 🏖️",
    
    "When stress builds up, try the **'stress container' exercise**:\n\n📦 Imagine your stress as water in a container\n🚰 What small things can let some water out?\n⏰ Even 5 minutes of deep breathing helps\n🎨 Creative activities release pressure\n\nWhat's one small stress-reliever you could try? 💧",
    
    "Remember the **three R's of stress management**:\n\n🔍 **Recognize** your stress signals\n📉 **Reduce** exposure to stressors when possible\n💪 **Build Resilience** through self-care\n\nWhat's one boundary you could set today? 🛡️"
  ],
  sleep: [
    "Sleep issues are common with mental health challenges. Try the **10-3-2-1-0 method**:\n\n❌ No caffeine 10 hours before bed\n🍽️ No food/alcohol 3 hours before\n💼 No work 2 hours before\n📱 No screens 1 hour before\n⏰ No snooze button!\n\nYour brain needs rest to heal. 🌙",
    
    "For better sleep, create a **relaxing bedtime routine**:\n\n🛁 Warm bath or shower\n📖 Read a physical book\n🎵 Calming music or sounds\n🌿 Lavender or chamomile tea\n🧘 Gentle stretching\n\nYour body will learn to associate these with sleep. 🛌",
    
    "If you can't sleep, don't fight it. Try this:\n\n🛏️ Get up after 20 minutes\n📚 Do something calming (no screens)\n☕ Warm caffeine-free drink\n📝 Write down racing thoughts\n🔙 Return to bed when sleepy\n\nThe pressure to sleep can make it harder. Trust your body. 🌠"
  ],
  motivation: [
    "Motivation comes and goes like the weather. Instead of waiting for motivation, try **tiny habits**:\n\n🎯 What's one thing you could do in 10 minutes?\n📈 Progress, not perfection\n🌟 Build momentum with small wins\n💫 Action often comes before motivation\n\nWhat's your 'one-inch picture frame' for today? 🖼️",
    
    "Break big tasks into **'one-inch picture frames'**:\n\n🔍 Instead of the whole project\n🎯 Focus on the very next small step\n🏆 Celebrate starting, not just finishing\n🌱 Small consistent actions build big results\n\nWhat's the smallest possible next step? 📝",
    
    "Remember your **'why'**. Reconnect with your deeper reasons:\n\n❤️ What matters most to you?\n🎯 How does this align with your values?\n🌟 What's the positive impact?\n💫 Let your purpose guide your actions\n\nYour 'why' can reignite motivation when willpower runs low. 🔥"
  ],
  general: [
    "Thank you for sharing that with me. It takes courage to talk about mental health. \n\n**Questions to reflect on**:\n\n💭 How has this been affecting your daily life?\n🌱 What's one thing that usually helps you feel even 1% better?\n🌟 What kind of support are you looking for right now?\n\nI'm here to listen and support you. 🌈",
    
    "I appreciate you opening up. Mental health is a journey with ups and downs.\n\n**Consider trying**:\n\n📝 Journaling your thoughts and feelings\n🎵 Music that matches or improves your mood\n🌳 A short walk in nature\n💝 One small act of self-kindness\n\nWhat resonates with you today? 💫",
    
    "That sounds challenging. Remember that **seeking help is strength**, not weakness.\n\n**Today, you could**:\n\n✅ Acknowledge your feelings without judgment\n💖 Speak to yourself like a good friend\n🌱 Take one small step forward\n🤝 Reach out for support\n\nYou're doing better than you think. 🌟"
  ],
  greetings: [
    "Hello! I'm MindCare AI, your mental health companion. 🌟\n\nI'm here to provide compassionate support, coping strategies, and a listening ear. Whether you need to talk, learn mindfulness techniques, or get through a tough moment, I'm here for you 24/7.\n\nHow are you feeling today? 💭",
    
    "Welcome to MindCare! I'm your AI mental health assistant. 💫\n\nI can help with:\n\n🧘 Stress management techniques\n😊 Mood tracking and understanding\n🌱 Coping strategies for anxiety/depression\n💤 Sleep improvement tips\n🎯 Motivation and goal setting\n\nWhat's on your mind right now? 🌈",
    
    "Hi there! I'm MindCare AI, designed to support your mental wellness journey. 🛡️\n\nI provide:\n\n🔹 Evidence-based mental health support\n🔹 Practical coping strategies\n🔹 Mindfulness and grounding exercises\n🔹 Emotional validation and understanding\n🔹 Crisis resources when needed\n\nHow can I support you today? 💖"
  ]
};

function getFallbackResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  if (/(hello|hi|hey|greetings|start)/.test(lowerMessage)) {
    return fallbackResponses.greetings[Math.floor(Math.random() * fallbackResponses.greetings.length)];
  } else if (/(anxious|anxiety|worried|nervous|panic|overwhelmed)/.test(lowerMessage)) {
    return fallbackResponses.anxiety[Math.floor(Math.random() * fallbackResponses.anxiety.length)];
  } else if (/(depress|sad|hopeless|empty|down|blue|worthless)/.test(lowerMessage)) {
    return fallbackResponses.depression[Math.floor(Math.random() * fallbackResponses.depression.length)];
  } else if (/(stress|overwhelm|pressure|burnout|tension)/.test(lowerMessage)) {
    return fallbackResponses.stress[Math.floor(Math.random() * fallbackResponses.stress.length)];
  } else if (/(sleep|insomnia|tired|exhausted|fatigue)/.test(lowerMessage)) {
    return fallbackResponses.sleep[Math.floor(Math.random() * fallbackResponses.sleep.length)];
  } else if (/(motivat|procrastinat|lazy|unproductive|stuck)/.test(lowerMessage)) {
    return fallbackResponses.motivation[Math.floor(Math.random() * fallbackResponses.motivation.length)];
  } else {
    return fallbackResponses.general[Math.floor(Math.random() * fallbackResponses.general.length)];
  }
}

// Chatbot endpoint
app.post('/api/chatbot/message', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    let aiResponse;

    if (openai) {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are MindCare AI, a compassionate mental health assistant. Provide supportive, empathetic responses with practical coping strategies. Use a warm, professional tone."
            },
            {
              role: "user",
              content: message
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
        });
        aiResponse = completion.choices[0].message.content;
        console.log('✅ OpenAI response generated');
      } catch (error) {
        console.log('❌ OpenAI error, using fallback:', error.message);
        aiResponse = getFallbackResponse(message);
      }
    } else {
      aiResponse = getFallbackResponse(message);
      console.log('✅ Fallback response generated');
    }

    res.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString(),
      usingOpenAI: !!openai
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.json({
      success: true,
      response: "I appreciate you reaching out. I'm having some technical difficulties right now, but please know that your feelings are valid. If you need immediate support, consider contacting a mental health professional.",
      timestamp: new Date().toISOString(),
      usingOpenAI: false
    });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'MindCare Pro API is working!',
    timestamp: new Date().toISOString(),
    openaiAvailable: !!openai
  });
});

// Get mental health resources
app.get('/api/resources', (req, res) => {
  const resources = {
    helplines: [
      { name: "National Suicide Prevention Lifeline", number: "988", available: "24/7" },
      { name: "Crisis Text Line", number: "Text HOME to 741741", available: "24/7" },
      { name: "SAMHSA National Helpline", number: "1-800-662-4357", available: "24/7" }
    ]
  };
  
  res.json({ success: true, data: resources });
});
const path = require('path');
const buildPath = path.join(__dirname, '../frontend/build');

app.use(express.static(buildPath));

app.get('/*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});


// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 MindCare Pro server running on port ${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}/api`);
  console.log(`🔐 Authentication: ACTIVE`);
  console.log(`🤖 OpenAI: ${openai ? 'ACTIVE' : 'FALLBACK MODE'}`);
  console.log(`\n💡 Test the server: http://localhost:${PORT}/api/test`);
  console.log(`💡 Frontend should connect to: http://localhost:${PORT}\n`);

});

