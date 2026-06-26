import React from 'react';
import CheckoutCard from '../Cards/CheckoutCard';
import Loader from '../Loader';
import getUid from '../../helpers/data/authData';
import type { Service } from '../../types';

type ServiceCollection = Service[] | Record<string, Service>;

interface Props {
  services: ServiceCollection;
  otherName?: any;
  submitOrder?: () => void;
  addToOrder: (index: number | string) => void;
}

interface State {
  services: ServiceCollection;
  loading: boolean;
  show: boolean;
  currentUserId?: string;
}

export default class YourCheckout extends React.Component<Props, State> {
  timer?: ReturnType<typeof setInterval>;

  state: State = {
    services: this.props.services,
    loading: true,
    show: true,
  };

  componentDidMount() {
    this.setState({
      currentUserId: getUid(),
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
      Object.values(this.props.services).map((service) => (
        <CheckoutCard
          key={service.firebaseKey}
          index={service.firebaseKey}
          service={service}
          addToOrder={this.props.addToOrder}
        />
      ));
    return (
      <>
        {loading ? (
          <Loader />
        ) : (
          <>
            <div>
              Your Smooches Inc Representative,{' '}
              {this.props.otherName[0][1] && this.props.otherName[0][1].name.split(' ')[0]},
              <br /> has authorized the following services:
            </div>
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
