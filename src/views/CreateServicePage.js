import React, { Component } from 'react';
import  YourInventory from '../components/YourInventory';
import ServiceData from '../helpers/data/serviceData';

export default class CreateServicePage extends Component {
  state = {
    user: this.props.user,
    otherKey: this.props.otherKey,
    services: [],
    requested: [],
    otherName: ''
  }

  componentDidMount() {
    this.getServices();
    if (this.props.otherName) {
      this.setState({ partnerName: this.props.otherName[0][1].name })
    }
  }

  getServices = () => ServiceData.getAllServices().then(services => {
    this.setState({
      services
    });
  });

  render() {
    return (
      <>
      <div className="servicePage">
        <div className="leftSide">
          <div className="tasksOffered">
           
            {<YourInventory />}
          </div>
        </div>
       </div>
      </>
    );
  }
}