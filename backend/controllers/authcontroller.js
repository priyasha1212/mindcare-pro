const db = require('../db_manager');
const bcrypt = require('bcrypt');

// Signup
exports.signup = (req, res) => {
    const { full_name, email, password } = req.body;
    if (!full_name || !email || !password)
        return res.status(400).json({ message: 'All fields are required' });

    const hashedPassword = bcrypt.hashSync(password, 10);
    const stmt = `INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)`;
    db.run(stmt, [full_name, email, hashedPassword], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint')) {
                return res.status(400).json({ message: 'Email already exists' });
            }
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        res.json({ message: 'Account created successfully', userId: this.lastID });
    });
};

// Login
exports.login = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: 'Email and password required' });

    const stmt = `SELECT * FROM users WHERE email = ?`;
    db.get(stmt, [email], (err, row) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err.message });
        if (!row) return res.status(400).json({ message: 'Invalid credentials' });

        const match = bcrypt.compareSync(password, row.password);
        if (!match) return res.status(400).json({ message: 'Invalid credentials' });

        res.json({ message: 'Login successful', user: { id: row.id, full_name: row.full_name, email: row.email } });
    });
};
