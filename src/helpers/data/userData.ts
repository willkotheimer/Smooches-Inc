// Userdata

import firebase from 'firebase/app';
import axios from 'axios';
import firebaseConfig from '../apiKeys';
import type { User, UserJoin } from '../../types';

const baseUrl = firebaseConfig.databaseURL;

type NewUser = Omit<User, 'firebaseKey'>;

const checkIfUserExistsInFirebase = (user: NewUser): void => {
  axios
    .get(`${baseUrl}/users.json?orderBy="uid"&equalTo="${user.uid}"`)
    .then((resp) => {
      if (Object.values(resp.data).length === 0) {
        axios
          .post(`${baseUrl}/users.json`, user)
          .then((response) => {
            const update = { firebaseKey: response.data.name };
            axios.patch(`${baseUrl}/users/${response.data.name}.json`, update);
          })
          .catch((error) => console.warn(error));
      } else {
        console.warn('User Already Exists');
      }
      window.sessionStorage.setItem('ua', 'true');
    })
    .catch((error) => console.error(error));
};

const createUserJoin = (userJoinObj: UserJoin) =>
  axios.post(`${baseUrl}/userjoin.json`, userJoinObj).then((response) => {
    const update = { firebaseKey: response.data.name };
    axios
      .patch(`${baseUrl}/userjoin/${response.data.name}.json`, update)
      .catch((error) => console.warn(error));
  });

const confirmUserJoin = (userJoinObj: UserJoin): void => {
  axios
    .patch(`${baseUrl}/userjoin/${userJoinObj.firebaseKey}.json`, { confirm: true })
    .catch((error) => console.warn(error));
};

const getUserByfirebaseKey = (firebaseKey: string) =>
  new Promise((resolve, reject) => {
    axios
      .get(`${baseUrl}/users/${firebaseKey}.json`)
      .then((response) => {
        // FIXME: AxiosResponse has no `.val`; this is a latent bug carried over
        // from the original JS. Left as-is for the type-in-place phase.
        resolve((response as any).val.child());
      })
      .catch((error) => reject(error));
  });

const getJoinedUser = (UID: string) =>
  new Promise<UserJoin[]>((resolve, reject) => {
    axios
      .get(`${baseUrl}/userjoin.json`)
      .then((response) => {
        const arr: UserJoin[] = [];
        if (response.data) {
          Object.values(response.data as Record<string, UserJoin>).forEach((entry) => {
            if (entry.user1FBKey === UID || entry.user2FBKey === UID) {
              arr.push(entry);
            }
          });
        }
        resolve(arr);
      })
      .catch((error) => reject(error));
  });

const deleteUserConnect = (firebaseKey: string) =>
  axios.delete(`${baseUrl}/userjoin/${firebaseKey}.json`);

const getAllUsers = () =>
  new Promise((resolve, reject) => {
    axios
      .get(`${baseUrl}/users.json`)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => reject(error));
  });

const getUserByUid = (uid: string) =>
  new Promise<[string, User][]>((resolve) => {
    const myArray: [string, User][] = [];
    axios
      .get(`${baseUrl}/users.json?orderBy="uid"&equalTo="${uid}"`)
      .then((response) => {
        Object.entries(response.data as Record<string, User>).forEach((item) => {
          myArray.push(item);
        });
        resolve(myArray);
      });
  }).catch((error) => {
    console.warn(error);
    return [];
  });

const getUserNameByUid = (uid: string) =>
  new Promise<unknown[]>((resolve) => {
    console.warn(uid);
    const myArray: unknown[] = [];
    // FIXME: iterates `response` instead of `response.data` and the `.catch` is
    // misplaced inside the executor; preserved from the original JS.
    axios
      .get(`${baseUrl}/users.json?orderBy="uid"&equalTo="${uid}"`)
      .then((response) => {
        Object.values(response).forEach((item) => {
          myArray.push(item);
        });
        resolve(myArray);
      })
      .catch((error) => console.warn(error));
  });

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
