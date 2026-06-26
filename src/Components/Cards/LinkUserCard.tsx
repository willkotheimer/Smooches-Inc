import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useConfirmUserJoin, useDeleteUserConnect } from '../../data/useUserData';

export default function LinkUserCard() {
  const { user, otherName, joinedUser: initialJoined } = useAppContext();
  const [joinedUser, setJoinedUser] = useState<any>(initialJoined);
  const confirmUserJoin = useConfirmUserJoin();
  const deleteUserConnect = useDeleteUserConnect();

  const rejectUser = () => {
    deleteUserConnect.mutate(joinedUser.firebaseKey);
    setJoinedUser(null);
  };

  const connectToUser = () => {
    confirmUserJoin.mutate(joinedUser);
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
