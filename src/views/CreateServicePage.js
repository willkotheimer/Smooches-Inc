import React, { Component } from 'react';
import  YourInventory from '../components/YourInventory';
import ToDoData from '../helpers/data/todoData';
import ServiceData from '../helpers/data/serviceData';
import ToDosCard from '../components/Cards/ToDosCard';

export default class CreateServicePage extends Component {
  state = {
    user: this.props.user,
    otherKey: this.props.otherKey,
    todos: [],
    services: [],
    requested: [],
    otherName: ''
  }

  componentDidMount() {
    this.getServices();
    this.getotheruserrequests();
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

  getotheruserrequests = () => ToDoData.getUserToDosArrayByUid(this.state.otherKey).then((toDos) => {
    this.setState({
      requested: toDos
    });
  });

  getTask = (firebaseKey) => this.state.services.filter((x) => x.firebaseKey === firebaseKey);

  completeTask = (firebaseKey, time) => {
    ToDoData.completeTask(firebaseKey, time).then((response) => {
      this.getotheruserrequests();
    })
  }

  render() {
    const { todos, requested } = this.state;

    const showToDos = () => 
  requested.filter((x) => x.completedTime === '')
  .map(service => (
        <ToDosCard key={service.firebaseKey+Date.now()}  firebaseKey={ service.firebaseKey } service={service} completeTask={this.completeTask} task={this.getTask(service.taskId)}  />
      ));

    return (
      <>
      <div className="servicePage">
        <div className="leftSide">
          <div className="tasksOffered">
           
            {<YourInventory />}
          </div>
        </div>
       <div className="rightSide">
         <div className="todos">
             <h3>To Dos:</h3>
             <div className="card m-2">
               {todos && showToDos()
               }
             </div>
           </div>
           
         </div>
      </div> 
      </>
    );
  }
}