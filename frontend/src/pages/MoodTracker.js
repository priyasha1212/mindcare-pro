import React, { useState } from "react";

const MoodTracker = () => {
  const [mood, setMood] = useState(6);
  const [note, setNote] = useState("");
  const [entries, setEntries] = useState([]);

  const add = () => {
    if (!note) return alert("Add a note");
    const e = { mood, note, created_at: new Date().toISOString() };
    setEntries([e, ...entries]);
    setNote("");
  };

  return (
    <div className="container mt-4">
      <h3>Mood Tracker</h3>
      <div className="card p-3 mb-3 shadow-sm">
        <label>Mood: {mood}</label>
        <input type="range" min="1" max="10" value={mood} onChange={(e)=>setMood(e.target.value)} className="form-range" />
        <textarea className="form-control my-2" rows="2" placeholder="Add note" value={note} onChange={(e)=>setNote(e.target.value)} />
        <button className="btn btn-primary" onClick={add}>Add Mood</button>
      </div>

      <h5>Entries</h5>
      {entries.length===0 && <p className="text-muted">No entries yet</p>}
      {entries.map((en, idx)=>(<div className="card p-2 mb-2" key={idx}><strong>{new Date(en.created_at).toLocaleString()}</strong><div>Mood: {en.mood}</div><div>{en.note}</div></div>))}
    </div>
  );
};

export default MoodTracker;
