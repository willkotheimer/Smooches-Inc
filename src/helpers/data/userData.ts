// Userdata

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

const createUserJoin = (userJoinObj: UserJoin) =>
  apiRequest<{ name: string }>('/userjoin.json', 'POST', userJoinObj).then((res) =>
    apiRequest(`/userjoin/${res.name}.json`, 'PATCH', { firebaseKey: res.name }),
  );

const confirmUserJoin = (userJoinObj: UserJoin): Promise<unknown> =>
  apiRequest(`/userjoin/${userJoinObj.firebaseKey}.json`, 'PATCH', { confirm: true });

const getUserByfirebaseKey = (firebaseKey: string) =>
  apiRequest<User>(`/users/${firebaseKey}.json`);

const getJoinedUser = (UID: string) =>
  apiRequest<Record<string, UserJoin> | null>('/userjoin.json').then((data) =>
    filterJoinedUsersByUid(data ? Object.values(data) : [], UID),
  );

const deleteUserConnect = (firebaseKey: string) =>
  apiRequest(`/userjoin/${firebaseKey}.json`, 'DELETE');

const getAllUsers = () =>
  apiRequest<Record<string, User> | null>('/users.json').then((data) => data ?? {});

const getUserByUid = (uid: string) =>
  apiRequest<Record<string, User> | null>(
    `/users.json?orderBy="uid"&equalTo="${uid}"`,
  ).then((data) => (data ? Object.entries(data) : []));

const getUserNameByUid = (uid: string) =>
  apiRequest<Record<string, User> | null>(
    `/users.json?orderBy="uid"&equalTo="${uid}"`,
  ).then((data) => (data ? Object.values(data) : []));

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
  createUserJoin,
  getUserByfirebaseKey,
  getJoinedUser,
  getAllUsers,
  getUserByUid,
  getUserNameByUid,
  confirmUserJoin,
  deleteUserConnect,
};
