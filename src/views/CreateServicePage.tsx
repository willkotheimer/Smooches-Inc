import React, { Component } from 'react';
import YourInventory from '../components/YourInventory';
import ServiceData from '../helpers/data/serviceData';
import type { Service } from '../types';

interface Props {
  user?: any;
  otherKey?: string;
  otherName?: any;
}

interface State {
  user: any;
  otherKey?: string;
  services: Service[];
  requested: any[];
  otherName: any;
  partnerName?: string;
}

export default class CreateServicePage extends Component<Props, State> {
  state: State = {
    user: this.props.user,
    otherKey: this.props.otherKey,
    services: [],
    requested: [],
    otherName: '',
  };

  componentDidMount() {
    this.getServices();
    if (this.props.otherName) {
      this.setState({ partnerName: this.props.otherName[0][1].name });
    }
  }

  getServices = () =>
    ServiceData.getAllServices().then((services) => {
      this.setState({
        services,
      });
    });

  render() {
    return (
      <>
        <div className="servicePage">
          <div className="leftSide">
            <div className="tasksOffered">{<YourInventory />}</div>
          </div>
        </div>
      </>
    );
  }
}
