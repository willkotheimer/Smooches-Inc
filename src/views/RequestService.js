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

  return <div><h3 className="title d-flex justify-content-center">Request Service</h3><br/>{loadRequestService()}</div>;
}
