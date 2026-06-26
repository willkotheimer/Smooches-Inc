import React from 'react';
import Auth from '../Components/Auth';
import Loader from '../Components/Loader';
import Dashboard from '../Components/Dashboard';

interface Props {
  user?: any;
  otherName?: any;
  otherKey?: string;
  userKey?: string;
  joinedUser?: any;
  joinedUserName?: string;
}

interface State {
  user: any;
  otherName: any;
  otherKey?: string;
  userKey?: string;
  joinedUser: any;
  todos: Record<string, unknown>;
  requested: Record<string, unknown>;
}

export default class DashboardView extends React.Component<Props, State> {
  state: State = {
    user: this.props.user,
    otherName: this.props.otherName,
    otherKey: this.props.otherKey,
    userKey: this.props.userKey,
    joinedUser: this.props.joinedUser,
    todos: {},
    requested: {},
  };

  loadDashboard = (user: any): React.ReactNode => {
    let component: React.ReactNode = '';
    if (user === null) {
      component = <Loader />;
    } else if (!user) {
      component = (
        <>
          <Auth />
        </>
      );
    } else {
      component = (
        <>
          <Dashboard
            user={user}
            otherName={this.props.otherName}
            otherKey={this.state.otherKey}
            userKey={this.state.userKey}
            joinedUser={this.state.joinedUser}
          />
        </>
      );
    }
    return component;
  };

  render() {
    const { user } = this.state;
    return <div>{this.loadDashboard(user)}</div>;
  }
}
