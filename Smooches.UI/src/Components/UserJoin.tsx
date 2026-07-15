import { useMemo } from 'react';
import LinkUserCard from './Cards/LinkUserCard';
import UserRequest from './Forms/UserRequest';
import Loader from './Loader';
import AppModal from './AppModal';
import { useAppContext } from '../context/AppContext';
import { useAllUsers } from '../data/useUserData';

export default function UserJoin() {
  const { user, joinedUser } = useAppContext();
  const { data: users, isLoading } = useAllUsers();

  const usersToConnect = useMemo(
    () => (users ? Object.values(users).filter((u) => u.uid !== (user as any)?.uid) : []),
    [users, user],
  );

  if (isLoading) return <Loader />;

  if (joinedUser) return <LinkUserCard />;

  return (
    <AppModal title={'Link User'} buttonLabel={'Link User'}>
      {usersToConnect ? (
        <UserRequest usersToConnect={usersToConnect} joinedUser={joinedUser} />
      ) : (
        'There are not any users to connect with'
      )}
    </AppModal>
  );
}
