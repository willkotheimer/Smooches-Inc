import React from 'react';
import {
    deleteService
  // deleteBoardPin,
  // PinBoardsAll
} from '../../helpers/data/serviceData';

export default class DeleteService extends React.Component {
  state = {
    name: this.props.service.name,
    firebaseKey: this.props.service.firebaseKey,
    services: this.props.services
  };

  handleSubmit = e => {
    e.preventDefault();
    // need to delete associate data, but allow any pending requests to go through?

    // PinBoardsAll().then(response => {
    //   if (response) {
    //     for (const [key, value] of Object.entries(response)) {
    //       if (Object.values(value).includes(this.state.firebaseKey)) {
    //         // 1 if needed, delete the board-pin [key]
    //         deleteBoardPin(key);
    //       }
    //     }
    //     // 2 delete the pin
    //     // Update state
    //     // deletePin(this.state.firebaseKey).then(() => this.props.redrawDom());
    //   }
    // });
    deleteService(this.state.firebaseKey).then(() => this.props.redrawDom());
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h1 className="deleteService">{this.state.name}</h1>
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
