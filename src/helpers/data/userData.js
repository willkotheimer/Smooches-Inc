// Userdata

import axios from 'axios';
import firebaseConfig from '../apiKeys';

const baseUrl = firebaseConfig.databaseURL;

const checkIfUserExistsInFirebase = (user) => {
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
      window.sessionStorage.setItem('ua', true);
    })
    .catch((error) => console.error(error));
};

const createUserJoin = (userJoinObj) => 
  axios.post(`${baseUrl}/userjoin.json`, userJoinObj).then(response => {
    const update = { firebaseKey: response.data.name };
  axios
    .patch(`${baseUrl}/userjoin/${response.data.name}.json`, update)
    .catch(error => console.warn(error));
});

const confirmUserJoin = (userJoinObj) => {
  console.warn(`${baseUrl}/userjoin/${userJoinObj.firebaseKey}.json`);
  axios
    .patch(
      `${baseUrl}/userjoin/${userJoinObj.firebaseKey}.json`, { confirm: true }
    ).catch(error => console.warn(error));
    }

const getUserByfirebaseKey = (firebaseKey) => 
  new Promise((resolve, reject) => {
    axios
      .get(`${baseUrl}/users/${firebaseKey}.json`)
      .then(response => {
        resolve(response.val.child());
      })
      .catch(error => reject(error));
  })

  const getJoinedUser = (UID) => 
  new Promise((resolve, reject) => {
  axios
    .get(`${baseUrl}/userjoin.json`)
    .then(response => {
      const arr = [];
      Object.values(response.data).forEach((entry) => {
        if(entry.user1FBKey === UID || entry.user2FBKey === UID) {
          arr.push(entry);
        }
      });
      resolve(arr);
    })
    .catch(error => reject(error));
});

const getAllUsers = () => 
  new Promise((resolve, reject) => {
  axios
    .get(`${baseUrl}/users.json`)
    .then(response => {
      resolve(response);
      })
      .catch(error => reject(error));
    })

    const getUserByUid = (uid) => 
    new Promise((resolve, reject) => {
      console.warn(`${baseUrl}/users.json?orderBy="uid"&equalTo="${uid}"`);
      axios.get(`${baseUrl}/users.json?orderBy="uid"&equalTo="${uid}"`)
        .then((response) => {
            resolve(response.data);
        });
    }).catch((error) => console.warn(error));
  
const setCurrentUser = (userObj) => {
    const user = {
      image: userObj.photoURL,
      uid: userObj.uid,
      name: userObj.displayName,
      email: userObj.email,
      lastSignInTime: userObj.metadata.lastSignInTime,
    };

  const loggedIn = window.sessionStorage.getItem('ua');
  if (!loggedIn) {
    checkIfUserExistsInFirebase(user);
  }
  return user;
};

// eslint-disable-next-line
export default  {
  setCurrentUser,
  createUserJoin,
  getUserByfirebaseKey,
  getJoinedUser,
  getAllUsers,
  getUserByUid,
  confirmUserJoin
}
