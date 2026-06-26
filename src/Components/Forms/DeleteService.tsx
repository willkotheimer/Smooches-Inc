import React from 'react';
import ServiceData from '../../helpers/data/serviceData';
import type { Service } from '../../types';

interface Props {
  service: Service;
  services?: Service[];
  redrawDom: () => void;
}

interface State {
  name: string;
  firebaseKey: string;
  services?: Service[];
}

export default class DeleteService extends React.Component<Props, State> {
  state: State = {
    name: this.props.service.name,
    firebaseKey: this.props.service.firebaseKey,
    services: this.props.services,
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    ServiceData.deleteService(this.state.firebaseKey).then(() => this.props.redrawDom());
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h3 className="deleteService">{this.state.name}</h3>
        <input type="hidden" name="firebaseKey" value={this.state.firebaseKey} />
        {/* Submits the form (delete). The original had a no-op onClick referencing
            an undefined handleClick; removed since it never did anything. */}
        <button>Delete</button>
      </form>
    );
  }
}
