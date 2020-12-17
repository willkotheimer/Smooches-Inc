import React, { Component } from 'react';
import RequestCard from '../Cards/RequestCard';
import ToDosCard from '../Cards/ToDosCard';
import ServiceData from '../../helpers/data/serviceData';
import ToDoData from '../../helpers/data/todoData';

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
    this.getotheruserrequests();
    if (this.props.otherName) {
      this.setState({ partnerName: this.props.otherName[0][1].name })
    }
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

render() {
    const { todos, requested } = this.state;

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
    <div className="todos">
         <h2>Your task to dos:</h2>
         <div className="card m-2">
         {todos && showToDos()}
         </div>
       </div>
       <div className="requested">
        
        <h2>Your Requests (Pending):</h2>
         <div className="card m-2">
          {requested && showRequests()}
         </div>
       </div>
    </div>
   <div className="rightSide">
     <div className="reviewsgiven2you">
         <h2>Reviews Given to you: (Hardcoded)</h2>
         <div className="card m-2">
           <div className="card-body">
             <h5 className="card-title">This was great!</h5>
             <p className="card-text">Thanks for making dinner</p>
             <p className="card-text">Friday</p>
             <div className="create-delete-btn"></div>
           </div>
         </div>
       </div>
       <div className="servicesData">
         <h2>Data of tasks (Hardcoded)</h2>
         <div className="card m-2">
           <div className="card-body">
             <h5 className="card-title">Tasks Finished</h5>
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
