import React from 'react';

export default class OrderHistory extends React.Component { 
  
  render() {
      const taskKey = this.props.toDo[0];
      const service = Object.values(this.props.services).filter((x) =>
      x.firebaseKey === taskKey);
      
  return (
    <div className="card m-2">
      <div className="card-body" id="">
        <h5 className="card-title">{service && service[0].name}</h5>
        <div>amount { this.props.toDo[1]} </div>
      </div>
    </div>
  );
  }
}
