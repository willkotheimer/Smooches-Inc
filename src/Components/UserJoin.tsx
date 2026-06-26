import { useEffect, useState } from 'react';
import userData from '../helpers/data/userData';
import LinkUserCard from './Cards/LinkUserCard';
import UserRequest from './Forms/UserRequest';
import Loader from './Loader';
import AppModal from './AppModal';
import { useAppContext } from '../context/AppContext';
import type { User } from '../types';

export default function UserJoin() {
  const { user, joinedUser } = useAppContext();
  const [usersToConnect, setUsersToConnect] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // On-mount fetch + brief loading delay: genuine side effects, so useEffect is needed.
  useEffect(() => {
    userData.getAllUsers().then((response: any) => {
      const arr = Object.values(response.data as Record<string, User>).filter(
        (u) => u.uid !== (user as any)?.uid,
      );
      setUsersToConnect(arr);
    });
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [user]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="d-flex flex-wrap container">
          {(joinedUser && <LinkUserCard />) || (
            <AppModal title={'Link User'} buttonLabel={'Link User'}>
              {usersToConnect ? (
                <UserRequest usersToConnect={usersToConnect} joinedUser={joinedUser} />
              ) : (
                'There are not any users to connect with'
              )}
            </AppModal>
          )}
        </div>
      )}
    </>
  );
}
