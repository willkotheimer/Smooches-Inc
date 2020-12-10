import React from 'react';
import { getUserServices } from '../../helpers/data/serviceData';
import CheckoutCard from '../Cards/CheckoutCard';
import Loader from '../Loader';
import getUid from '../../helpers/data/authData';


export default class YourCheckout extends React.Component {
  state = {
    services: [],
    loading: true,
    show: true,
    
  };

  componentDidMount() {
    this.setState({
      currentUserId: getUid()
    });
    this.getServices();
  }

  getServices = () => {
    const UID = this.props.otherKey;
    getUserServices(UID).then(response => {
      this.setState(
        {
          services: response.data
        },
        this.setLoading
      );
    });
  };

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
      Object.values(services).map(service => (
        <CheckoutCard key={service.firebaseKey} service={service} redrawDom={this.getServices} />
      ));
    return (
      <>
        {loading ? (
          <Loader />
        ) : (
          <>
        
            <div>Your Smooch's Inc Representative, {this.props.otherName[Object.keys(this.props.otherName)].name} has authorized the following services:</div>
            <div className="d-flex flex-wrap container">
              {services && showServices()}
            </div>
          </>
        )}
      </>
    );
  }
}
