import React from 'react';
import Auth from '../components/Auth';
import Loader from '../components/Loader';

export default function LeaveReview({ user }) {
  const loadLeaveReview = () => {
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
              Leave Review
            </>
          );
        }
    return component;
  };

  return <div>LeaveReview{loadLeaveReview()}</div>;
}
