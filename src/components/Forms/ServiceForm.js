import React, { Component } from 'react';
import getUser from '../../helpers/data/authData';
import { createService, updateService } from '../../helpers/data/serviceData';

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
      createService(this.state).then(() => {
        this.props.onUpdate();
        this.setState({ isModalOpen: false });
      });
    } else {
      updateService(this.state).then(() => {
          console.warn(this.state);
        // rerender / update state in the services component
        this.props.onUpdate(this.props.service.firebaseKey);
        this.setState({ isModalOpen: false });
      });
    }
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h1>Service Form</h1>
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
