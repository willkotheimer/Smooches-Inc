import React from 'react';
import Auth from '../components/Auth';
import Loader from '../components/Loader';
import RequestServicePage from './RequestServicePage';

export default function RequestService({ user, otherName, otherKey, joinedUser }) {
  const loadRequestService = () => {
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
              <RequestServicePage user={user} uid={user.uid} otherName={otherName} joinedUser={joinedUser} otherKey={otherKey} />
            </>
          );
        }
    return component;
  };

  return <div>{loadRequestService()}</div>;
}
