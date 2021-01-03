import React, { Component } from 'react';
import ReviewTasks from '../components/ReviewTasks';
import ToDoData from '../helpers/data/todoData';
import ReviewData from '../helpers/data/reviewData';
import YourPreviousReviews from '../components/YourPreviousReviews';
import TheirPreviousReviews from '../components/TheirPreviousReviews';

export default class LeaveReviewPage extends Component {
  state = {
    user: this.props.user,
    reviews: {},
    theirReviews: [],
    yourReviews: [],
    todos: []
  }

  componentDidMount() {
    this.getReviews();
  };

  getTodos = () => ToDoData.getCompletedToDosByUid(this.props.otherKey).then((stuff) => {
    this.setState({
      toDos: stuff
    });
  });

  getReviews = () => {
    ReviewData.getAllReviews().then(stuff => {
      this.setState(
        {
          reviews: stuff
        }
      );
      const yourReviews = [];
      const theirReviews = [];
      Object.values(stuff).forEach(item => {
        if ((item.uid === this.state.user.uid) && 
          (this.state.user.uid !== undefined)) {
          yourReviews.push(item);
        } else {
          theirReviews.push(item);
        }
      });
      if (yourReviews.length) {
        this.setState({
          yourReviews
        })
      };
      if (theirReviews.length) {
        this.setState({
          theirReviews
        })
      };
    });
  }

  updateReviewPage = () => {
    this.getReviews();
  }

  yourPreviousReviews = () => 
    this.state.yourReviews.slice(Math.max(this.state.yourReviews.length - 5, 1)).reverse().map(review => (
      <YourPreviousReviews key={review.firebaseKey} previousReview={review} service={review.serviceid} otherName={this.props.joinedUserName} />
    ));
  
  theirPreviousReviews = () => 
    this.state.theirReviews.slice(Math.max(this.state.theirReviews.length - 5, 1)).reverse().map(review => (
      <TheirPreviousReviews key={review.firebaseKey} previousReview={review} service={review.serviceid} otherName={this.props.joinedUserName} />
    ));

  render() {
    const { user, theirReviews, yourReviews } = this.state;
    return (
      <>
      <div className="servicePage">
        <div className="leftSide">
          <div className="reviewsToGiveDiv">
          <>
              <ReviewTasks user={user} 
              otherName={this.props.otherName} 
              otherKey={this.props.otherKey}
              userKey={ this.props.userKey} 
              joinedUser={ this.props.joinedUser }
              onUpdate={ this.updateReviewPage } />
            </> 
          </div>
        </div>
       <div className="rightSide">
         <div className="previousReviewsGivenDiv">
             <h4>Previous Reviews Given</h4>
             <div className="fullLine"></div>
             {yourReviews && this.yourPreviousReviews()}
           </div>
           <div className="reviewsGivenToYouDiv">
             <h4>Reviews Given To You</h4>
             <div className="fullLine"></div>
             {theirReviews!==undefined && this.theirPreviousReviews()
             }
           </div>
         </div>
      </div> 
      </>
    );
  }
}