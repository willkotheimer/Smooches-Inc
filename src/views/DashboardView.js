import React from 'react';
import Auth from '../components/Auth';
import Loader from '../components/Loader';
import Dashboard from '../components/Dashboard';

export default class DashboardView extends React.Component {
  state = {
    user: this.props.user,
    otherName: this.props.otherName,
    todos: this.props.todos,
    requested: this.props.requested
  }

  loadDashboard = (user,otherName,todos,requested) => {
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
              <Dashboard otherName={otherName} todos={todos} requested={requested} />
            </>
          );
        }
    return component;
  };

  render() {
    const { user,otherName,todos,requested } = this.state;
  return <div>{this.loadDashboard(user, otherName,todos,requested)}</div>;
  }
}
