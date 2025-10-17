import React from "react";

const FeatureCard = ({ title, description, icon }) => {
  return (
    <div className="card text-center" style={{ width: "200px" }}>
      <div style={{ fontSize: "40px", marginBottom: "10px" }}>{icon}</div>
      <h5>{title}</h5>
      <p>{description}</p>
    </div>
  );
};

export default FeatureCard;
