import React, { Component } from 'react';
import  YourInventory from '../components/YourInventory';

export default class CreateServicePage extends Component {
  state = {
    user: this.props.user,
  }

  render() {
    return (
      <>
      <div className="servicePage d-flex justify-content-center">
        <div className="leftSide">
          <div className="tasksOffered">
           
            {<YourInventory />}
          </div>
        </div>
       <div className="rightSide">
         <div className="todos">
             <h3>To Dos: (Hardcoded)</h3>
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
             <h3>Services Data (Hardcoded)</h3>
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