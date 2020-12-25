import React from 'react';

export default function ServiceCard({ service, addToOrder, index, key }) {
  return (
    <div key={key} className="d-flex">
      <div className="card-body" id={service.fireBaseKey}>
        <h5 className="card-title"><i>{service.name}</i></h5>
        <p className="card-text">{service.description}</p>
        </div>
        <button className="checkoutButton" onClick={() => addToOrder(index)}><i className="far fa-heart">+</i></button>
    
    </div>
  );
}
