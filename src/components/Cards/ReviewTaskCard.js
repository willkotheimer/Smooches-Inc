import React from 'react';
import AppModal from '../AppModal';
import ReviewForm from '../Forms/ReviewForm';

export default class ReviewTaskCard extends React.Component { 
  
  render() {
      const taskKey = this.props.toDo.taskId;
      const toDoId = this.props.toDo.firebaseKey;
      const service = Object.values(this.props.services).filter((x) =>
      x.firebaseKey === taskKey);
      
  return (
    <div className="card m-2">
      <div className="card-body" id="">
        <h5 className="card-title">{service[0].name}</h5>
        <AppModal title={'Leave a Review'} buttonLabel={'Leave a Review'}>
         <ReviewForm toDoId={toDoId} taskid={taskKey} onUpdate={this.props.onUpdate} />
        </AppModal>
      </div>
    </div>
  );
  }
}
