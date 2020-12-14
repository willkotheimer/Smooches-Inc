import React, { Component } from 'react';
// import RequestCard from '../Cards/RequestCard';
// import ToDosCard from '../Cards/ToDosCard';
import { getTaskByFBKey } from '../../helpers/data/serviceData';

export default class Dashboard extends Component {
  state = {
    user: this.props.user,
    otherName: this.props.otherName,
    todos: this.props.todos,
    requested: this.props.requested,
    
  }

getServiceInfo = (myKey) => getTaskByFBKey(myKey.taskId);

// mapRequests = () => {

// }

// mapToDos = () => {

// }

render() {
  
  // const connectionName = otherName[4];
  
  // const showRequests = () => 
  //     Object.values(requested).map(service => (
  //       <RequestCard key={service} service={service} />
  //     ));
  // const showToDos = () => 
  //     Object.values(todos).map(service => (
  //       <ToDosCard key={service} service={service}  />
  //     ));
return (
  <>
  <div className="servicePage d-flex justify-content-center">
    <div className="leftSide">
    <div className="todos">
         <h2>Your to dos: (Hardcoded)</h2>
         <div className="card m-2">
          
         </div>
       </div>
       <div className="requested">
         <h2>'s Requests (Pending): (Hardcoded)</h2>
         <div className="card m-2">
          
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
