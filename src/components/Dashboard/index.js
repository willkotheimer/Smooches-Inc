import React, { Component } from 'react';
import RequestCard from '../Cards/RequestCard';
import ToDosCard from '../Cards/ToDosCard';
import ServiceData from '../../helpers/data/serviceData';
import ToDoData from '../../helpers/data/todoData';
import ReviewData from '../../helpers/data/reviewData';
import TheirPreviousReviews from '../TheirPreviousReviews';


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
    partnerName: ''
  }

  componentDidMount() {
    this.getServices();
    this.getTodos();
    this.getReviews();
    this.getotheruserrequests();
    if (this.props.otherName) {
      this.setState({ partnerName: this.props.otherName[0][1].name })
    }
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
        this.setState({
          theirReviews
        })
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

  getTask = (firebaseKey) => this.state.services.filter((x) => x.firebaseKey === firebaseKey);

  theirPreviousReviews = () => 
    this.state.theirReviews.map(review => (
      <TheirPreviousReviews previousReview={review} />
    ));

render() {
    const { todos, requested, reviews, theirReviews } = this.state;

  const showRequests = () => 
      todos.map(service => (
        <RequestCard key={service.firebaseKey+Date.now()} service={service} task={this.getTask(service.taskId)} />
     ));
    
  const showToDos = () => 
  requested.map(service => (
        <ToDosCard key={service.firebaseKey+Date.now()}  firebaseKey= { service.firebaseKey } service={service} completeTask={this.completeTask} task={this.getTask(service.taskId)}  />
      ));
  
return (
  <>
  <div className="servicePage d-flex justify-content-center">
    <div className="leftSide">
    <div className="tasksToComplete">
         <h3 className="taskHeader">Your task to dos:</h3>
         <div className="card m-2">
         {todos && showToDos()}
         </div>
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
         <h3>Data of tasks (Hardcoded)</h3>
         
           <div className="card-body">
             <h5 className="card-title">Tasks Finished</h5>
             <p className="card-text">8</p>
             <div className="create-delete-btn"></div>
           </div>
        
       </div>
     </div>
  </div> 
  </>
);
}
}
