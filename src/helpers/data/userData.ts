// User data used by the imperative auth bootstrap in <App>. Component data access
// goes through the React Query hooks in src/data/ instead.

import firebase from 'firebase/app';
import { apiRequest } from './apiClient';
import type { User, UserJoin } from '../../types';

type NewUser = Omit<User, 'firebaseKey'>;

const checkIfUserExistsInFirebase = (user: NewUser): void => {
  apiRequest<User[]>(`/users?uid=${user.uid}`)
    .then((existing) => {
      if (!existing || existing.length === 0) {
        apiRequest('/users', 'POST', user).catch((error) => console.warn(error));
      } else {
        console.warn('User Already Exists');
      }
      window.sessionStorage.setItem('ua', 'true');
    })
    .catch((error) => console.error(error));
};

// The server filters joins to those where the uid is either participant.
const getJoinedUser = (UID: string) => apiRequest<UserJoin[]>(`/userjoins?uid=${UID}`);

// Returned as [firebaseKey, user] entries to match the existing <App> usage.
const getUserByUid = (uid: string) =>
  apiRequest<User[]>(`/users?uid=${uid}`).then((list) =>
    (list ?? []).map((u) => [u.firebaseKey, u] as [string, User]),
  );

const setCurrentUser = (userObj: firebase.User): NewUser => {
  const user: NewUser = {
    image: userObj.photoURL as string,
    uid: userObj.uid,
    name: userObj.displayName as string,
    email: userObj.email as string,
    lastSignInTime: userObj.metadata.lastSignInTime as string,
  };

  const loggedIn = window.sessionStorage.getItem('ua');
  if (!loggedIn) {
    checkIfUserExistsInFirebase(user);
  }
  return user;
};

export default {
  setCurrentUser,
  getJoinedUser,
  getUserByUid,
};
