import React, { Component } from 'react';
import  YourCheckout from '../components/YourCheckout';
import { getUserServices } from '../helpers/data/serviceData';
import getUid from '../helpers/data/authData';
import YourOrder from '../components/YourOrder';

export default class RequestServicePage extends Component {

    state = {
        user: this.props.user,
        otherName: this.props.otherName,
        otherKey: this.props.otherKey,
        userKey: this.props.userKey,
        joinedUser: this.props.joinedUser,
        order: {},
        services: {}
      }

      componentDidMount() {
        this.setState({
          currentUserId: getUid(),
          otherKey: this.props.otherKey
        });
        this.getServices();
      }

      getServices = () => {
        const UID = this.state.otherKey;
        getUserServices(UID).then(response => {
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

      addToOrder = key => {
        // 1. take a copy of state
        const order = { ...this.state.order };
        // 2. Either add to the order, or update the number in our order
        order[key] = order[key] + 1 || 1;
        // 3. Call setState to update our state object
        this.setState({ order });
      };

        removeFromOrder = key => {
          // 1. take a copy of state
          const order = { ...this.state.order };
          // 2. remove that itemf from order
          delete order[key];
          // 3. Call setState to update our state object
          this.setState({ order });
        };
    
  render() {
    const { user } = this.state;
    return (
      <>
      <div className="servicePage d-flex justify-content-center">
        <div className="leftSide">
          <div className="createService">
            <h2>Inventory:</h2>
            {<YourCheckout addToOrder={this.addToOrder} services={this.state.services} user={user} userKey={this.state.userKey} otherKey={this.props.otherKey} joinedUser={this.props.joinedUser} otherName={this.props.otherName}  />}
          </div>
        </div>
       <div className="rightSide">
         <div className="todos">
             <h2>Your</h2>
             <div className="card m-2">
              {<YourOrder order={this.state.order} services={this.state.services} removeFromOrder={this.removeFromOrder} />}
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
      </>
    );
  }
}