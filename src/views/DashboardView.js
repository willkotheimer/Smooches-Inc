import React from 'react';
import Auth from '../components/Auth';
import Loader from '../components/Loader';
import Dashboard from '../components/Dashboard';

export default class DashboardView extends React.Component {
  state = {
    user: this.props.user,
    otherName: this.props.otherName,
    otherKey: this.props.otherKey,
    userKey: this.props.userKey,
    joinedUser: this.props.joinedUser,
    todos: {},
    requested: {},
  }

  loadDashboard = (user) => {
    let component = '';
    if (user === null) {
      component = <Loader />;
    } else if (!user) {
        component = (
            <>
              <Auth />
              Not Logged in
            </>
          );
        } else {
          component = (
            <>
              <Dashboard user={user} 
              otherName={this.props.otherName} 
              otherKey={this.state.otherKey}
              userKey={ this.state.userKey} 
              joinedUser={this.state.joinedUser} />
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
