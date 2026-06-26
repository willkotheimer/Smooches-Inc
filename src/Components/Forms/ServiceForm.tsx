import React, { Component } from 'react';
import getUser from '../../helpers/data/authData';
import ServiceData from '../../helpers/data/serviceData';
import type { Service } from '../../types';

interface Props {
  service?: Service;
  firebaseKey?: string;
  onUpdate?: () => void;
  // Injected at runtime by AppModal via React.cloneElement.
  toggle?: () => void;
  user?: any;
}

type State = Service;

export default class ServiceForm extends Component<Props, State> {
  state: State = {
    firebaseKey: this.props.service?.firebaseKey || '',
    name: this.props.service?.name || '',
    // FIXME: `userId` is a typo for `uid` on the service prop in the original JS,
    // so this has always defaulted to ''. Preserved for now.
    uid: (this.props.service as any)?.userId || '',
    description: this.props.service?.description || '',
    offerDescription: this.props.service?.description || '',
  };

  componentDidMount() {
    const userId = getUser();
    this.setState({
      uid: userId,
    });
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      [e.target.name]: e.target.value,
    } as unknown as Pick<State, keyof State>);
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (this.state.firebaseKey === '') {
      this.setState({
        firebaseKey: this.props.firebaseKey || '',
      });
    }

    if (this.state.firebaseKey === '') {
      ServiceData.createService(this.state).then(() => {
        this.props.onUpdate?.();
        this.props.toggle?.();
      });
    } else {
      ServiceData.updateService(this.state).then(() => {
        // rerender / update state in the services component
        this.props.onUpdate?.();
        this.props.toggle?.();
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
