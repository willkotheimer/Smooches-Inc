import React from 'react';

export default class RequestCard extends React.Component { 

  render() {
    const { name, description } = this.props.task[0] || "task";
  return (
    <div className="card m-2">
      <div id={
        // eslint-disable-next-line
        this.props.service.firebaseKey} className="card-body d-flex justify-content-between" id="">
        <div>
        <h5 className="card-title">{name}</h5>
        <p className="card-text description">{description}</p>
        <p className="card-text date">Requested: {this.props.service.requestedTime}</p>
        </div>
        
        <div className="d-flex">
        { (this.props.service.completedTime) && <button className="hideButton" onClick={() => this.props.hideRequest(this.props.service.firebaseKey)}><i class="fas fa-eye-slash"></i></button>}
        <div className={(this.props.service.completedTime)? 'done status' : 'pending status'}>{(this.props.service.completedTime)? 'Done!' : 'Pending'} </div>
        </div>
      </div>
    </div>
  );
  }
}