import React from 'react';

export default function LinkUserCard({otherName, user, otherKey, joinedUser}) {
  return (
    <div className="card m-2">
      <div className="card-body">
      <h5 className="card-title">{otherName[Object.keys(otherName)].name} 
      {(otherName[Object.keys(otherName)].confirm) ? ' is connected' : ' is pending...'}.</h5>
      <div>{(joinedUser.user2FBKey === user.uid) ? ('connect/cancel') : ('nothing')}</div>
      </div>
    </div>
  );

}
