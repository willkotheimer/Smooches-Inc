import { useState } from 'react';
import userData from '../../helpers/data/userData';
import { useAppContext } from '../../context/AppContext';

export default function LinkUserCard() {
  const { user, otherName, joinedUser: initialJoined } = useAppContext();
  const [joinedUser, setJoinedUser] = useState<any>(initialJoined);

  const rejectUser = () => {
    userData.deleteUserConnect(joinedUser.firebaseKey);
    setJoinedUser(null);
  };

  const connectToUser = () => {
    userData.confirmUserJoin(joinedUser);
    setJoinedUser({ ...joinedUser, confirm: true });
    console.warn('connect');
  };

  return (
    <>
      <div className="card m-2">
        <div className="card-body">
          <h5 className="card-title">
            {otherName[0][1].name}
            {joinedUser && joinedUser.confirm ? ' is connected' : ' is pending...'}.
          </h5>
          <div>
            {joinedUser && joinedUser.user2FBKey === (user as any).uid && !joinedUser.confirm ? (
              <>
                <button onClick={connectToUser} className="btn btn-danger">
                  Connect
                </button>
                <button onClick={rejectUser} className="btn btn-danger">
                  Reject
                </button>
              </>
            ) : (
              joinedUser && joinedUser.confirm && 'congrats!'
            )}
          </div>
        </div>
      </div>
    </>
  );
}
