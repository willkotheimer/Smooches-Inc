import React, { Component } from 'react';
import getUser from '../../helpers/data/authData';
import ServiceData from '../../helpers/data/serviceData';

export default class ServiceForm extends Component {

  state = {
    firebaseKey: this.props.service?.firebaseKey || '',
    name: this.props.service?.name || '',
    uid: this.props.service?.userId || '',
    description: this.props.service?.description || '',
    offerDescription: this.props.service?.description || '',
  };

  componentDidMount() {
    const userId = getUser();
    this.setState({
      uid: userId,
    });
  }

  handleChange = e => {
      this.setState({
        [e.target.name]: e.target.value
      });
  };

  handleSubmit = e => {
    e.preventDefault();
    if (this.state.firebaseKey === '') {
      this.setState({
        firebaseKey: this.props.firebaseKey
      });
    }  
  
    if (this.state.firebaseKey === '') {

      ServiceData.createService(this.state).then(() => {
        this.props.onUpdate();
        this.props.toggle();
      });
    } else {
      // add in a check to see if deleted
      ServiceData.updateService(this.state).then(() => {
        // rerender / update state in the services component
        this.props.onUpdate();
        this.props.toggle();
      });
    }
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h3>Service Form</h3>
        <input
          type="text"
          name="name"
          value={this.state.name}
          onChange={this.handleChange}
          placeholder="Service Name"
          className="form-control form-control-lg m-1"
          required
        />
        <input
          type="text"
          name="description"
          value={this.state.description}
          onChange={this.handleChange}
          placeholder="Service Description"
          className="form-control form-control-lg m-1"
          required
        />
        <input
          type="text"
          name="offerDescription"
          value={this.state.offerDescription}
          onChange={this.handleChange}
          placeholder="Optional: This is a special offer"
          className="form-control form-control-lg m-1"
        />
    
        <button>Submit</button>
      </form>
    );
  }
}
