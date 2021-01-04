import React from 'react';
import Auth from '../components/Auth';
import Loader from '../components/Loader';
import CreateServicePage from './CreateServicePage';

export default function CreateService({ user, otherKey }) {
  const loadCreateService = () => {
    let component = '';
    if (user === null) {
      component = <Loader />;
    } else if (!user) {
      component = (
        <>
          <Auth />
        </>
      );
    } else if (user){
      component = (
        <>
          <CreateServicePage user={user} otherKey={otherKey} />
        </>
      );
    }
    return component;
  };

  return <div><h3 className="title d-flex justify-content-center">Create Service</h3><br/>{loadCreateService()}</div>;
}
