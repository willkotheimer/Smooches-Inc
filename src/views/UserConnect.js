import React from 'react';
import Auth from '../components/Auth';
import Loader from '../components/Loader';
import LinkAccountsPage from './LinkAccountsPage';

export default function UserConnect({ user, otherName, otherKey, userKey, joinedUser }) {
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
              <LinkAccountsPage user={user} otherName={otherName} otherKey={otherKey} userKey={userKey} joinedUser={joinedUser}  />
            </>
          );
        }
    return component;
  };

  return <div><h1 className="title d-flex justify-content-center">Connect with a user</h1><br/>{loadUserConnect()}</div>;
}
