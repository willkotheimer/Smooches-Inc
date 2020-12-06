import React from 'react';
import Auth from '../components/Auth';
import Loader from '../components/Loader';

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
              Dashboard
            </>
          );
        }
    return component;
  };

  return <div>Dashboard{loadDashboard()}</div>;
}
