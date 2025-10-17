const db = require("../db_manager");

exports.add = (req, res) => {
  const { user_id, task, date } = req.body;
  if (!user_id || !task) return res.status(400).json({ message: "user_id and task required" });
  db.run("INSERT INTO planner (user_id, task, date, completed) VALUES (?, ?, ?, 0)", [user_id, task, date || null], function (err) {
    if (err) return res.status(500).json({ message: "Failed to add task" });
    res.status(201).json({ id: this.lastID, message: "Task added" });
  });
};

exports.list = (req, res) => {
  const user_id = req.query.user_id;
  if (!user_id) return res.status(400).json({ message: "user_id required" });
  db.all("SELECT * FROM planner WHERE user_id = ? ORDER BY id DESC", [user_id], (err, rows) => {
    if (err) return res.status(500).json({ message: "Failed to fetch tasks" });
    res.json(rows);
  });
};