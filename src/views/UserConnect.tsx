import React from 'react';
import Auth from '../components/Auth';
import Loader from '../components/Loader';
import LinkAccountsPage from './LinkAccountsPage';

interface Props {
  user?: any;
  otherName?: any;
  otherKey?: string;
  userKey?: string;
  joinedUser?: any;
}

export default function UserConnect({ user, otherName, otherKey, userKey, joinedUser }: Props) {
  const loadUserConnect = (): React.ReactNode => {
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
          <LinkAccountsPage
            user={user}
            otherName={otherName}
            otherKey={otherKey}
            userKey={userKey}
            joinedUser={joinedUser}
          />
        </>
      );
    }
    return component;
  };

  return (
    <div>
      <h3 className="title d-flex justify-content-center">Connect with a user</h3>
      <br />
      {loadUserConnect()}
    </div>
  );
}
