import React, { Component } from 'react';
import getUser from '../../helpers/data/authData';
import userData from '../../helpers/data/userData';
import type { User } from '../../types';

interface Props {
  usersToConnect: User[];
  otherUser?: { firebaseKey?: string };
  joinedUser?: any;
}

interface State {
  user1FBKey: string;
  user2FBKey: string;
  confirm: boolean;
}

export default class UserRequest extends Component<Props, State> {
  state: State = {
    user1FBKey: '',
    user2FBKey: this.props.otherUser?.firebaseKey || '',
    confirm: false,
  };

  componentDidMount() {
    const userId = getUser();
    this.setState({
      user1FBKey: userId,
    });
  }

  handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({
      [e.target.name]: e.target.value,
    } as unknown as Pick<State, keyof State>);
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // state has no firebaseKey yet; the backend assigns it on create.
    userData.createUserJoin(this.state as any).then(() => {
      console.warn('made user', this.state);
    });
  };

  render() {
    const arr = Object.values(this.props.usersToConnect).map((option) => (
      <option key={option.uid} value={option.uid}>
        {option.name}
      </option>
    ));
    return (
      <form onSubmit={this.handleSubmit}>
        <h3>User Request Form</h3>
        (No users will be linked to until confirmed)
        User available to link to:
        <select
          className="browser-default custom-select"
          name="user2FBKey"
          onChange={this.handleChange}
        >
          <option>select a user</option>
          {arr}
        </select>
        <button>Submit</button>
      </form>
    );
  }
}
