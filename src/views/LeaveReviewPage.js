import React, { Component } from 'react';
import ReviewTasks from '../components/ReviewTasks';
import ReviewData from '../helpers/data/reviewData';
import YourPreviousReviews from '../components/YourPreviousReviews';
import TheirPreviousReviews from '../components/TheirPreviousReviews';

export default class LeaveReviewPage extends Component {
  state = {
    user: this.props.user,
    reviews: {},
    theirReviews: [],
    yourReviews: []
  }

  componentDidMount() {
    this.getReviews();
  };

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
    window.location.reload(false);
  }

  yourPreviousReviews = () => 
    this.state.yourReviews.map(review => (
      <YourPreviousReviews previousReview={review} />
    ));
  

  theirPreviousReviews = () => 
    this.state.theirReviews.map(review => (
      <TheirPreviousReviews previousReview={review} />
    ));
  

  render() {
    const { user, theirReviews, yourReviews } = this.state;
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
              joinedUser={ this.props.joinedUser }
              onUpdate={ this.updateReviewPage } /> 
            </> 
          </div>
        </div>
       <div className="rightSide">
         <div className="previousReviews">
             <h2>Previous Reviews Given</h2>
             {yourReviews && this.yourPreviousReviews()}
           </div>
           <div className="servicesData">
             <h2>Reviews Given To You</h2>
             {theirReviews && this.theirPreviousReviews()}
           </div>
         </div>
      </div> 
      </>
    );
  }
}