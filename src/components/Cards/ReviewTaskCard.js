import React from 'react';
import toDosCard from './ToDosCard';

export default class ReviewTaskCard extends React.Component { 
  
  render() {
      const key = this.props.toDo.taskId;
      const service = Object.values(this.props.services).filter((x) =>
      x.firebaseKey === key);
    
  return (
    <div className="card m-2">
      <div className="card-body" id="">
        <h5 className="card-title">{service[0].name}</h5>
        <button onClick={() => this.props.reviewTask(this.props.firebaseKey)}>ReviewTask</button>
      </div>
    </div>
  );
  }
}
