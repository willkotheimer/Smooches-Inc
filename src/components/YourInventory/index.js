import React from 'react';
import ServiceData from '../../helpers/data/serviceData';
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
    ServiceData.getUserServices(UID).then(response => {
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
        <ServiceCard key={`${service.firebaseKey}Date.now()`} service={service} redrawDom={this.getServices} />
      ));
    return (
      <>
        {loading ? (
          <Loader />
        ) : (
          <>
            
            <h3 className="taskHeader">Tasks You Offer:</h3>
           
              {services && showServices()}
           
            <div className="createServiceButton">
            <AppModal title={'Create A New Task'} buttonLabel={'Create A New Task +'}>
              <ServiceForm services={services} onUpdate={this.getServices} />
            </AppModal>
            </div>
            
          </>
        )}
      </>
    );
  }
}
