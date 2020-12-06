import React from 'react';
import { getUserServices } from '../../helpers/data/serviceData';
import ServiceCard from '../Cards/ServiceCard';
import ServiceForm from '../Forms/ServiceForm';
import Loader from '../Loader';
import getUid from '../../helpers/data/authData';
import AppModal from '../AppModal';

export default class YourInventory extends React.Component {
  state = {
    services: [],
    loading: true,
    show: true
  };

  componentDidMount() {
    this.setState({
      currentUserId: getUid()
    });
    this.getServices();
  }

  getServices = () => {
    const UID = getUid();
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
        <ServiceCard key={service.firebaseKey} service={service} redrawDom={this.getServices} />
      ));
    return (
      <>
        {loading ? (
          <Loader />
        ) : (
          <>
            <AppModal title={'Create Service'} buttonLabel={'Create Service'}>
              <ServiceForm services={services} onUpdate={this.getServices} />
            </AppModal>

            <div>Here are all of your Services:</div>
            <div className="d-flex flex-wrap container">
              {services && showServices()}
            </div>
          </>
        )}
      </>
    );
  }
}
