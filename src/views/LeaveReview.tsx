import React from 'react';
import Auth from '../Components/Auth';
import Loader from '../Components/Loader';
import LeaveReviewPage from './LeaveReviewPage';

interface Props {
  user?: any;
  otherName?: any;
  otherKey?: string;
  userKey?: string;
  joinedUser?: any;
  joinedUserName?: string;
}

export default function LeaveReview({
  user,
  otherName,
  otherKey,
  userKey,
  joinedUser,
  joinedUserName,
}: Props) {
  const loadLeaveReview = (): React.ReactNode => {
    let component: React.ReactNode = '';
    if (user === null) {
      component = <Loader />;
    } else if (!user) {
      component = (
        <>
          <h3 className="title d-flex justify-content-center">Leave Review</h3>
          <br />
          <Auth />
        </>
      );
    } else {
      component = (
        <>
          <LeaveReviewPage
            otherName={otherName}
            otherKey={otherKey}
            userKey={userKey}
            joinedUser={joinedUser}
            joinedUserName={joinedUserName}
            user={user}
          />
        </>
      );
    }
    return component;
  };

  return <div>{loadLeaveReview()}</div>;
}
