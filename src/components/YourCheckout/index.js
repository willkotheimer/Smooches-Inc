import React from 'react';
import CheckoutCard from '../Cards/CheckoutCard';
import Loader from '../Loader';
import getUid from '../../helpers/data/authData';
import AppModal from '../AppModal';


export default class YourCheckout extends React.Component {
  state = {
    services: this.props.services,
    loading: true,
    show: true,
    
  };

  componentDidMount() {
    this.setState({
      currentUserId: getUid()
    });
    this.setLoading();
  }

  setLoading = () => {
    this.timer = setInterval(() => {
      this.setState({ loading: false });
    }, 1000);
  };

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const { services, loading } = this.state;
    const showServices = () => 
      Object.values(this.props.services).map(service => (
        <CheckoutCard key={service.firebaseKey} index={service.firebaseKey} service={service} submitOrder={this.props.submitOrder} addToOrder={this.props.addToOrder} />
      ));
    return (
      <>
        {loading ? (
          <Loader />
        ) : (
          <>
            <div>Your Smooch's Inc Representative, {this.props.otherName[Object.keys(this.props.otherName)].name} has authorized the following services:</div>
            <div className="tasksOffered">
              <h3 className="checkoutHeader">Tasks Offered</h3>
              
              {services && showServices()}
            </div>
          </>
        )}
      </>
    );
  }
}
