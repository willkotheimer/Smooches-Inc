import React from 'react';
import Auth from '../components/Auth';
import Loader from '../components/Loader';
import DashboardView from './DashboardView';

export default function Dashboard({ user, otherName, otherKey, userKey, joinedUser  }) {
  const loadDashboard = () => {
    let component = '';
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
              <DashboardView user={user} otherName={otherName} otherKey={otherKey} userKey={userKey} joinedUser={joinedUser} />
            </>
          );
        }
    return component;
  };

  return <div><h3 className="title d-flex justify-content-center">Dashboard</h3><br/>{loadDashboard()}</div>;
}
