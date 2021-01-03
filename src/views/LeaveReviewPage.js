import React, { Component } from 'react';
import Rebase from 're-base';
import firebase from 'firebase';
import ServiceData from '../helpers/data/serviceData';
import ToDoData from '../helpers/data/todoData';
import ReviewTaskCard from '../components/Cards/ReviewTaskCard';
import Loader from '../components/Loader';
import ReviewData from '../helpers/data/reviewData';
import YourPreviousReviews from '../components/YourPreviousReviews';
import TheirPreviousReviews from '../components/TheirPreviousReviews';

export default class LeaveReviewPage extends Component {
  state = {
    user: this.props.user,
    reviews: {},
    theirReviews: [],
    yourReviews: [],
    services: [],
    toDos: [],
    loading: true,
  }

  componentDidMount() {
    this.getReviews();
    this.getServices();
    this.getTodos();
    this.setLoading();
    const base = Rebase.createClass(firebase.database());
    base.listenTo('review', {
      context: this,
      asArray: true,
      then(){
        this.getTodos();
      }
    });
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

  getServices = () => {
    ServiceData.getAllServices().then(stuff => {
      this.setState(
        {
          services: stuff
        },
        this.setLoading
      );
    });
  };

  setLoading = () => {
    this.timer = setInterval(() => {
      this.setState({ loading: false });
    }, 1000);
  };
  
  redrawDom = () => {
    this.getReviews();
    this.getTodos();
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
    const { theirReviews, yourReviews, toDos, services, loading } = this.state;
    const showUnreviewed = () => 
    Object.values(toDos)
    .filter((x) => x.reviewed !== true)
    .map(toDo => (
      <ReviewTaskCard key={toDo.firebaseKey} services={services} toDo={toDo} onUpdate={this.redrawDom} />
    ));

    return (
      <>
      <div className="servicePage">
        <div className="leftSide">
          <div className="reviewsToGiveDiv">
          <>
        {loading ? (
          <Loader />
        ) : (
          <>
           
            <h3 className="reviewHeader">Completed Tasks To Review:</h3>
            <div className="d-flex flex-wrap">
              {toDos && showUnreviewed()}
            </div>
            
          </>
        )}
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