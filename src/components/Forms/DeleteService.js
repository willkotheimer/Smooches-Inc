import React from 'react';
import ServiceData from '../../helpers/data/serviceData';

export default class DeleteService extends React.Component {
  state = {
    name: this.props.service.name,
    firebaseKey: this.props.service.firebaseKey,
    services: this.props.services
  };

  handleSubmit = e => {
    e.preventDefault();
    
    ServiceData.deleteService(this.state.firebaseKey).then(() => this.props.redrawDom());
    
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h3 className="deleteService">{this.state.name}</h3>
        <input
          type="hidden"
          name="firebaseKey"
          value={this.state.firebaseKey}
        />
        <button onClick={e => this.handleClick}>Delete</button>
      </form>
    );
  }
}
