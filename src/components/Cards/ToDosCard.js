import React from 'react';

export default function toDosCard({ service, task }) {
  const { name } = task[0] || "task";
  
  // console.warn("here",name)
  return (
    <div className="card m-2">
      <div className="card-body" id="">
        <h5 className="card-title">{name}</h5>
        <p className="card-text">Time: {service.requestedTime}</p>
        <div className="buy-service-btn"></div>
        <button>Complete Service</button>
      </div>
    </div>
  );
}
