import { useState } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
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
  };

  const pendingForMe =
    joinedUser && joinedUser.user2FBKey === (user as any).uid && !joinedUser.confirm;

  return (
    <Card tone="blue">
      <h3 className="font-bold">
        {otherName[0][1].name}
        <span className="font-normal text-muted">
          {joinedUser && joinedUser.confirm ? ' is connected' : ' is pending…'}
        </span>
      </h3>
      <div className="mt-2 flex items-center gap-2">
        {pendingForMe ? (
          <>
            <Button size="sm" onClick={connectToUser}>
              <i className="fa-solid fa-check" aria-hidden /> Connect
            </Button>
            <Button variant="ghost" size="sm" onClick={rejectUser}>
              Reject
            </Button>
          </>
        ) : (
          joinedUser && joinedUser.confirm && <span className="text-accent">congrats! 🎉</span>
        )}
      </div>
    </Card>
  );
}
