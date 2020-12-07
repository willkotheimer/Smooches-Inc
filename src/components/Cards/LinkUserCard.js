import React from 'react';

export default function LinkUserCard({connectedUser}) {
 
  return (
    <div className="card m-2">
      {console.warn('he;lp', connectedUser.name)}
      <div className="card-body">
        <h5 className="card-title">{connectedUser.name} {(connectedUser.confirm) ? 'is connected' : 'is pending'}.</h5>
      </div>
    </div>
  );

}
