import React, { Component } from 'react';
import  YourCheckout from '../components/YourCheckout';
import ServiceData from '../helpers/data/serviceData';
import getUid from '../helpers/data/authData';
import YourOrder from '../components/YourOrder';
import toDoData from '../helpers/data/todoData';

export default class RequestServicePage extends Component {
    state = {
        user: this.props.user,
        otherName: this.props.otherName,
        otherKey: this.props.otherKey,
        userKey: this.props.userKey,
        joinedUser: this.props.joinedUser,
        order: {},
        services: {},
        submission: {},
        submitted: false,
        allServices: [],
        otherUserToDosCount: []
      }

      componentDidMount() {
        const uid = getUid();
        this.setState({
          currentUserId: uid,
          otherKey: this.props.otherKey
        });
        this.getServices();
      }

      componentWillUnmount() {
        this.setState = (state,callback)=>{
          return null;
      };
      }
      
      getServices = () => {
        const UID = this.state.otherKey;
        ServiceData.getUserServices(UID).then(response => {
          this.setState(
            {
              services: response.data
            },
            this.setLoading()
          );
        });
      };

      setLoading = () => {
        this.timer = setInterval(() => {
          this.setState({ loading: false });
        }, 1000);
      };

      submitOrder = () => {
        // Get things we need:
        const dateTime = new Date();
        // Object to hold the objects:
        const postObj = [];
        // Get the keys of items in current state [order]
           Object.keys(this.state.order).map((key) => {
            postObj.push({
              "requesterId": `${this.props.uid}`,
              "uid": `${this.props.otherKey}`,
              "taskId": `${key}`,
              "status": "pending",
              "reviewId": "",
              "requestedTime": `${dateTime.toDateString()}`,
              "completedTime": ""
            });
            return postObj;
           });
        // Create the objects from the keys and record them into the submission state
         postObj.forEach((item) => {
          toDoData.createToDo(item).then(() => {
            // remove everything and post in state:
            this.removeAll();
            // Confirm submission 
            
          });
         })
      }

      addToOrder = key => {
        // 1. take a copy of state
        const order = { ...this.state.order };
        // 2. Either add to the order, or update the number in our order
        order[key] = 1;
        // 3. Call setState to update our state object
        this.setState({ order });
        this.startOver(); // reset submit confirmation 
      };

        removeFromOrder = key => {
          // 1. take a copy of state
          const order = { ...this.state.order };
          // 2. remove that item from order
          delete order[key];
          // 3. Call setState to update our state object
          this.setState({ order });
        };

        removeAll = () => {
          // 1. take a copy of state
          let order = { ...this.state.order };
          order = {};
          // 3. Call setState on submitted and update our state object for object
          this.setState({ order });
          this.setState({ submitted: true });
        };

        startOver = () => {
          this.setState({ submitted: false });
        }

    
  render() {
    const { user } = this.state;

    return (
      <>
      <div className="servicePage">
        <div className="leftSide">
          <div className="createService">
            <h3>Your Smooch's Inc partner's Inventory:</h3>
            {<YourCheckout 
            addToOrder={this.addToOrder}
            services={this.state.services} 
            user={user} userKey={this.state.userKey} 
            otherKey={this.props.otherKey} 
            joinedUser={this.props.joinedUser} 
            otherName={this.props.otherName}  
            />}
          </div>
        </div>
       <div className="rightSide d-flex flex-column">
         <div className="todos">
             <div className="requestRightDiv">
              {<YourOrder order={this.state.order} 
              submitted={this.state.submitted} 
              services={this.state.services} 
              requestedId={this.state.currentUserId} 
              submitOrder={this.submitOrder} 
              removeFromOrder={this.removeFromOrder} />}
               </div>
             </div>
            
           
           </div>
         </div>
      </>
    );
  }
}