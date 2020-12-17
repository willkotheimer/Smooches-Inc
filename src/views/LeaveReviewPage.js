import React, { Component } from 'react';
import ReviewTasks from '../components/ReviewTasks';

export default class LeaveReviewPage extends Component {
  state = {
    user: this.props.user,
  }

  render() {
    const { user } = this.state;
    return (
      <>
      <div className="servicePage d-flex justify-content-center">
        <div className="leftSide">
          <div className="leaveReview">
          <>
              <ReviewTasks user={user} 
              otherName={this.props.otherName} 
              otherKey={this.props.otherKey}
              userKey={ this.props.userKey} 
              joinedUser={this.props.joinedUser} /> 
            </> 
          </div>
        </div>
       <div className="rightSide">
         <div className="todos">
             <h2>Previous Reviews Given</h2>
             <div className="card m-2">
               <div className="card-body">
                 <h5 className="card-title">Make dinner</h5>
                 <p className="card-text">Make dinner for me</p>
                 <p className="card-text">Friday</p>
                 <div className="create-delete-btn"></div>
               </div>
             </div>
           </div>
           <div className="servicesData">
             <h2>Reviews Given To You</h2>
             <div className="card m-2">
               <div className="card-body">
                 <h5 className="card-title">This was so nice!</h5>
                 <p className="card-text">8</p>
                 <div className="create-delete-btn"></div>
               </div>
             </div>
           </div>
         </div>
      </div> 
      </>
    );
  }
}