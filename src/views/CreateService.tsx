import React from 'react';
import firebase from 'firebase/app';
import Auth from '../components/Auth';
import Loader from '../components/Loader';
import CreateServicePage from './CreateServicePage';

interface Props {
  user: firebase.User | false | null;
  otherKey?: string;
  otherName?: any;
  joinedUser?: any;
}

export default function CreateService({ user, otherKey }: Props) {
  const loadCreateService = (): React.ReactNode => {
    let component: React.ReactNode = '';
    if (user === null) {
      component = <Loader />;
    } else if (!user) {
      component = (
        <>
          <Auth />
        </>
      );
    } else if (user) {
      component = (
        <>
          <CreateServicePage user={user} otherKey={otherKey} />
        </>
      );
    }
    return component;
  };

  return (
    <div>
      <h3 className="title d-flex justify-content-center">Create Service</h3>
      <br />
      {loadCreateService()}
    </div>
  );
}
