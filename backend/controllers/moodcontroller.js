const db = require("../db_manager");

exports.add = (req, res) => {
  const { user_id, mood, note } = req.body;
  if (!user_id || !mood) return res.status(400).json({ message: "user_id and mood required" });
  db.run("INSERT INTO mood_entries (user_id, mood, note, created_at) VALUES (?, ?, ?, datetime('now'))", [user_id, mood, note || ""], function (err) {
    if (err) return res.status(500).json({ message: "Failed to add mood" });
    res.status(201).json({ message: "Added", id: this.lastID });
  });
};

exports.list = (req, res) => {
  const user_id = req.query.user_id;
  if (!user_id) return res.status(400).json({ message: "user_id required" });
  db.all("SELECT * FROM mood_entries WHERE user_id = ? ORDER BY id DESC", [user_id], (err, rows) => {
    if (err) return res.status(500).json({ message: "Failed to fetch" });
    res.json(rows);
  });
};
