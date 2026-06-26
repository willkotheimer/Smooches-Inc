import React from 'react';
import Auth from '../components/Auth';
import Loader from '../components/Loader';
import DashboardView from './DashboardView';

interface Props {
  user?: any;
  otherName?: any;
  otherKey?: string;
  userKey?: string;
  joinedUser?: any;
  joinedUserName?: string;
}

export default function Dashboard({ user, otherName, otherKey, userKey, joinedUser }: Props) {
  const loadDashboard = (): React.ReactNode => {
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
          <DashboardView
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
      <h3 className="title d-flex justify-content-center">Dashboard</h3>
      <br />
      {loadDashboard()}
    </div>
  );
}
