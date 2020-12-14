import React from 'react';

export default function ServiceCard({ service, addToOrder, index, key }) {
  return (
    <div key={key} className="card m-2">
      <div className="card-body" id={service.fireBaseKey}>
        <h5 className="card-title">{service.name}</h5>
        <p className="card-text">{service.description}</p>
        <div className="buy-service-btn"></div>
        <button onClick={() => addToOrder(index)}>Order {service.name}</button>
      </div>
    </div>
  );
}
