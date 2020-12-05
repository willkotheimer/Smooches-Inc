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
          Request Service
        </>
      );
    } else {
      component = <Auth />;
    }
    return component;
  };

  return <div>Dashboard{loadDashboard()}</div>;
}
