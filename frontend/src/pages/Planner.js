import React, { useState } from "react";

const Planner = ({ isLoggedIn, setShowLogin }) => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const add = () => {
    if (!isLoggedIn) { setShowLogin(true); return; }
    if (!task) return;
    setTasks([{ id: Date.now(), task }, ...tasks]);
    setTask("");
  };

  return (
    <div className="container mt-4">
      <h3>Planner</h3>
      <div className="card p-3 mb-3 shadow-sm">
        <div className="d-flex">
          <input className="form-control me-2" placeholder="New task" value={task} onChange={(e)=>setTask(e.target.value)} />
          <button className="btn btn-primary" onClick={add}>Add</button>
        </div>
        {!isLoggedIn && <small className="text-muted mt-2 d-block">Sign in to save tasks permanently.</small>}
      </div>

      <h5>Your tasks</h5>
      {tasks.length===0 && <p className="text-muted">No tasks yet.</p>}
      {tasks.map(t=>(<div className="card p-2 mb-2" key={t.id}>{t.task}</div>))}
    </div>
  );
};

export default Planner;
