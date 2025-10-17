exports.chat = (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: "Message required" });
  const replies = [
    "Take a breath — small steps matter.",
    "That's valid. How long have you felt this way?",
    "You're not alone. Consider sharing with someone trusted.",
    "Try a 2-minute breathing exercise right now."
  ];
  const reply = replies[Math.floor(Math.random() * replies.length)];
  res.json({ reply });
};
