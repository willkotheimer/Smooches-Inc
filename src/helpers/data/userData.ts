// User data used by the imperative auth bootstrap in <App>. Component data access
// goes through the React Query hooks in src/data/ instead.

import firebase from 'firebase/app';
import { apiRequest } from './apiClient';
import { filterJoinedUsersByUid } from '../../Helper/UserDataHelper';
import type { User, UserJoin } from '../../types';

type NewUser = Omit<User, 'firebaseKey'>;

const checkIfUserExistsInFirebase = (user: NewUser): void => {
  apiRequest<Record<string, User> | null>(`/users.json?orderBy="uid"&equalTo="${user.uid}"`)
    .then((data) => {
      if (!data || Object.values(data).length === 0) {
        apiRequest<{ name: string }>('/users.json', 'POST', user)
          .then((res) => apiRequest(`/users/${res.name}.json`, 'PATCH', { firebaseKey: res.name }))
          .catch((error) => console.warn(error));
      } else {
        console.warn('User Already Exists');
      }
      window.sessionStorage.setItem('ua', 'true');
    })
    .catch((error) => console.error(error));
};

const getJoinedUser = (UID: string) =>
  apiRequest<Record<string, UserJoin> | null>('/userjoin.json').then((data) =>
    filterJoinedUsersByUid(data ? Object.values(data) : [], UID),
  );

const getUserByUid = (uid: string) =>
  apiRequest<Record<string, User> | null>(
    `/users.json?orderBy="uid"&equalTo="${uid}"`,
  ).then((data) => (data ? Object.entries(data) : []));

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
