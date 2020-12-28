import React, { Component } from 'react';
import RequestCard from '../Cards/RequestCard';
import ToDosCard from '../Cards/ToDosCard';
import ServiceData from '../../helpers/data/serviceData';
import ToDoData from '../../helpers/data/todoData';
import ReviewData from '../../helpers/data/reviewData';
import TheirPreviousReviews from '../TheirPreviousReviews';
import LeaderBoardData from '../../helpers/data/leaderboardData';
import OrderHistory from '../Cards/OrderHistory';

export default class Dashboard extends Component {

  state = {
    user: this.props.user,
    otherName: this.props.otherName,
    otherKey: this.props.otherKey,
    userKey: this.props.userKey,
    joinedUser: this.props.joinedUser,
    services: [],
    todos: [],
    requested: [],
    partnerName: '',
    doneTodos: null,
    avgDoneToDos: null,
    starValues: [],
    userToDosCount: [],
    otherUserToDosCount: []
  }

  componentDidMount() {
    this.getServices();
    this.getTodos();
    this.getReviews();
    this.getotheruserrequests();
    this.getLeaderBoardInfo();
    if (this.props.otherName) {
      this.setState({ partnerName: this.props.otherName[0][1].name })
    }
    this.getUserRequests();
  }

  getReviews = () => {
    ReviewData.getAllReviews().then(stuff => {
      this.setState(
        {
          reviews: stuff
        }
      );
      
      const theirReviews = [];
      Object.values(stuff).forEach(item => {
        if ((item.uid !== this.state.user.uid) && 
          (this.state.user.uid !== undefined)) {
            theirReviews.push(item);
        } 
      });

      if (theirReviews.length) {
        this.reviewsGottenData(theirReviews);
        this.setState({
          theirReviews
        });
      };
    });
  }

  getServices = () => ServiceData.getAllServices().then(services => {
    this.setState({
      services
    });
  });

  getTodos = () =>  ToDoData.getUserToDosArrayByUid(this.state.userKey).then((toDos) => {
      this.setState({
        requested: toDos
      });
    });

  getotheruserrequests = () => ToDoData.getUserToDosArrayByUid(this.state.otherKey).then((toDos) => {
      this.setState({
        todos: toDos
      });
    });

  completeTask = (firebaseKey, time) => {
    ToDoData.completeTask(firebaseKey, time).then((response) => {
      this.getTodos();
    })
  }

  hideTask = (firebaseKey) => {
    ToDoData.hideTask(firebaseKey).then((response) => {
      this.getTodos();
    })
  }

  hideRequest = (firebaseKey) => {
    ToDoData.hideTask(firebaseKey).then((response) => {
      this.getotheruserrequests();
    })
  }

  getTask = (firebaseKey) => this.state.services.filter((x) => x.firebaseKey === firebaseKey);

  theirPreviousReviews = () => 
    this.state.theirReviews.map(review => (
      <TheirPreviousReviews key={review.firebaseKey} previousReview={review} service={review.serviceid} otherName={this.state.partnerName} />
    ));
  
    getUserRequests = () => {
    ToDoData.getUserToDosCountArrayByUid(this.state.userKey).then((data) => {
      this.setState({
        userToDosCount: data
      })
    });
  }

  reviewsGottenData = (theirReviews) => {
    let one = 0; let two = 0; let three =0;
    let four = 0; let five = 0;
    const revData = [];
    theirReviews.forEach((review) => {
      if (review.reviewStars=== "1") {
        one++;
    } else if (review.reviewStars=== "2") {
        two++;
    } else if (review.reviewStars=== "3") {
        three+=1
    } else if (review.reviewStars=== "4") {
        four+=1;
    } else if (review.reviewStars=== "5") {
        five+=1;
    }
    });
    revData.push(one, two, three, four, five);
    this.setState({
      starValues: revData
    });
  }

  getLeaderBoardInfo = () => {
    LeaderBoardData.getTaskLeaderBoards(this.state.userKey).then((array) => {
      this.setState({
        doneTodos: array.numberToDos,
        avgDoneToDos: array.avgToDos
      })
    });
  }


render() {
    const { userToDosCount, doneTodos, avgDoneToDos, todos, requested, theirReviews, services } = this.state;
  
  const showUserRequests = () => 
    userToDosCount.map(toDo => (
      <OrderHistory toDo={ toDo } services={services} />
    ));

  const showRequests = () => 
      todos
      .filter(service => service.hidden !== true)
      .map(service => (
        <RequestCard key={service.firebaseKey+Date.now()} service={service} hideRequest={this.hideRequest} task={this.getTask(service.taskId)} />
     ));
    
  const showToDos = () => 
  requested
  .filter(service => service.hidden !== true)
  .map(service => (
        <ToDosCard key={service.firebaseKey+Date.now()}  
        firebaseKey={ service.firebaseKey } 
        service={service} 
        completeTask={this.completeTask} 
        hideTask={this.hideTask}
        otherName={this.props.otherName} 
        task={this.getTask(service.taskId)}  />
      ));

return (
  <>
  <div className="servicePage d-flex justify-content-center">
    <div className="leftSide">
    <div className="tasksToComplete">
         <h3 className="taskHeader">Your task to dos:</h3>
         {todos && showToDos()}
       </div>
       <div className="requestLeftDiv">
        
        <h3 className="requestHeader">All Tasks Requested By You:</h3>
          {requested && showRequests()}
       </div>
    </div>
   <div className="rightSide">
     <div className="reviewsGivenToYouDiv">
     <h3 className="reviewHeader">Reviews Given to you:</h3>
         
             {theirReviews && this.theirPreviousReviews()}
        
       </div>
       <div className="servicesData">
           <div className="card-body">
             <h5 className="card-title">Tasks Data</h5>
             <p className="card-text">Finished Tasks: {doneTodos}</p>
             <p className="card-text">Percent done: {(avgDoneToDos*100).toFixed(2)}%</p>
             <div>
               <h1>
               other user requests
                 </h1>
               {userToDosCount && showUserRequests()}
             </div>
           </div>
        
       </div>
     </div>
  </div> 
  </>
);
}
}
