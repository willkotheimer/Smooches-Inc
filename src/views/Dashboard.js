import React from 'react';
import Auth from '../components/Auth';
import Loader from '../components/Loader';
import DashboardView from './DashboardView';

export default function Dashboard({ user }) {
  const loadDashboard = () => {
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
              <DashboardView user={user}/>
            </>
          );
        }
    return component;
  };

  return <div>Dashboard{loadDashboard()}</div>;
}
