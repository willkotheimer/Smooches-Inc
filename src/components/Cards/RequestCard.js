import React from 'react';

export default function RequestCard({ service, task }) {
  const { name } = task[0] || "task";
  return (
    <div className="card m-2">
      <div className="card-body" id={service.firebaseKey}>
        <h5 className="card-title">{name}</h5>
        <p className="card-text">Requested:{service.requestedTime} </p>
        <div>Service Pending</div>
      </div>
    </div>
  );
}