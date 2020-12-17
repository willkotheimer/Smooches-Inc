import React from 'react';

export default class toDosCard extends React.Component { 
  
  render() {
    const { completedTime } = this.props.service;
    const { name } = this.props.task[0] || "task";
    const dateTime = new Date();
  return (
    <div className="card m-2">
      <div className="card-body" id="">
        <h5 className="card-title">{name}</h5>
        <p className="card-text">Time: {this.props.service.requestedTime}</p>
        <div className="completed?">{(this.props.service.completedTime)? 'completed' : 'pending'} </div>
        <div className="buy-service-btn"></div>
        <button onClick={() => this.props.completeTask(this.props.firebaseKey, dateTime)}>Complete Task</button>
      </div>
    </div>
  );
  }
}
