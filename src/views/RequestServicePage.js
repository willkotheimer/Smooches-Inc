import React, { Component } from 'react';
import  YourCheckout from '../components/YourCheckout';

export default class RequestServicePage extends Component {
    state = {
        user: this.props.user,
        otherName: this.props.otherName,
        otherKey: this.props.otherKey,
        userKey: this.props.userKey,
        joinedUser: this.props.joinedUser
      }

  render() {
      const { user } = this.state;
    return (
      <>
      <div className="servicePage d-flex justify-content-center">
        <div className="leftSide">
          <div className="createService">
            <h2>Inventory:</h2>
            {<YourCheckout user={user} userKey={this.props.userKey} otherKey={this.props.otherKey} joinedUser={this.props.joinedUser} otherName={this.props.otherName} />}
          </div>
        </div>
       <div className="rightSide">
         <div className="todos">
             <h2>To Dos: (Hardcoded)</h2>
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
             <h2>Services Data (Hardcoded)</h2>
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