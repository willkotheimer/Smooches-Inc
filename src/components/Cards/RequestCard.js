import React from 'react';

export default class RequestCard extends React.Component { 

  render() {
    const { name } = this.props.task[0] || "task";
  return (
    <div className="card m-2">
      <div className="card-body" id={this.props.service.firebaseKey}>
        <h5 className="card-title">{name}</h5>
        <p className="card-text">Requested:{this.props.service.requestedTime} </p>
        <div>{(this.props.service.completedTime)? 'completed' : 'pending'}</div>
      </div>
    </div>
  );
  }
}