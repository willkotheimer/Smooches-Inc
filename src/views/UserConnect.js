import React from 'react';
import Auth from '../components/Auth';
import Loader from '../components/Loader';

export default function UserConnect({ user }) {
  const loadUserConnect = () => {
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
              Connect Component Here
            </>
          );
        }
    return component;
  };

  return <div><h1 className="title d-flex justify-content-center">Connect with a user</h1><br/>{loadUserConnect()}</div>;
}
