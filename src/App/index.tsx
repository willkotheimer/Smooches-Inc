import { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import { BrowserRouter as Router } from 'react-router-dom';
import fbConnection from '../helpers/data/connection';
import Navbar from '../Components/Navbar';
import Routes from '../helpers/routes';
import userData from '../helpers/data/userData';
import getUid from '../helpers/data/authData';

fbConnection();

export default function App() {
  const [user, setUser] = useState<firebase.User | false | null>(null);
  const [joinedUser, setJoinedUser] = useState<any>('');
  const [userKey, setUserKey] = useState('');
  const [otherKey, setOtherKey] = useState('');
  const [otherName, setOtherName] = useState<any>('');
  const [joinedUserName, setJoinedUserName] = useState('');

  const getYourJoinedUser = (currentUser: firebase.User) => {
    userData.getJoinedUser(getUid()).then((response) => {
      const joined = response[0];
      setJoinedUser(joined);
      if (joined) {
        const isUser1 = currentUser.uid === joined.user1FBKey;
        const myKey = isUser1 ? joined.user1FBKey : joined.user2FBKey;
        const partnerKey = isUser1 ? joined.user2FBKey : joined.user1FBKey;
        setUserKey(myKey);
        setOtherKey(partnerKey);
        userData.getUserByUid(partnerKey).then((value) => {
          setOtherName(value);
          setJoinedUserName(value[0][1].name);
        });
      }
    });
  };

  // The auth listener is a real subscription, so useEffect is genuinely needed here.
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        userData.setCurrentUser(authUser);
        setUser(authUser);
        getYourJoinedUser(authUser);
      } else {
        setUser(false);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <div className="App">
      <Router>
        <Navbar user={user} />
        <Routes
          joinedUser={joinedUser}
          otherName={otherName}
          user={user}
          userKey={userKey}
          otherKey={otherKey}
          joinedUserName={joinedUserName}
        />
      </Router>
    </div>
  );
}
