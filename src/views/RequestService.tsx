import React from 'react';
import Auth from '../Components/Auth';
import Loader from '../Components/Loader';
import RequestServicePage from './RequestServicePage';

interface Props {
  user?: any;
  otherName?: any;
  otherKey?: string;
  userKey?: string;
  joinedUser?: any;
}

export default function RequestService({ user, otherName, otherKey, joinedUser }: Props) {
  const loadRequestService = (): React.ReactNode => {
    let component: React.ReactNode = '';
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
          <RequestServicePage
            user={user}
            uid={user.uid}
            otherName={otherName}
            joinedUser={joinedUser}
            otherKey={otherKey}
          />
        </>
      );
    }
    return component;
  };

  return (
    <div>
      <h3 className="title d-flex justify-content-center">Request Service</h3>
      <br />
      {loadRequestService()}
    </div>
  );
}
