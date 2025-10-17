exports.get = (req, res) => {
  const exercises = [
    { id: 1, title: "4-7-8 Breathing", steps: ["Inhale 4s", "Hold 7s", "Exhale 8s"] },
    { id: 2, title: "Box Breathing", steps: ["Inhale 4s", "Hold 4s", "Exhale 4s", "Hold 4s"] },
  ];
  res.json({ exercises });
};
