import React from 'react';
import Auth from '../components/Auth';
import Loader from '../components/Loader';
import LeaveReviewPage from './LeaveReviewPage';

export default function LeaveReview({ user, otherName, otherKey, userKey, joinedUser }) {
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
              <LeaveReviewPage otherName={otherName} otherKey={otherKey} userKey={userKey} joinedUser={joinedUser} user={user} />
            </>
          );
        }
    return component;
  };

  return <div>LeaveReview{loadLeaveReview()}</div>;
}
