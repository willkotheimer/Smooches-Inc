import axios from 'axios';
import firebaseConfig from '../apiKeys';

const baseUrl = firebaseConfig.databaseURL;

// const getAllUsers = () => new Promise((resolve, reject) => {
//   axios
//     .get(`${baseUrl}/users.json`)
//     .then((response) => {
//       const userData = response.data;
//       const users = [];
//       if (userData) {
//         Object.keys(userData).forEach((userId) => {
//           users.push(userData[userId]);
//         });
//       }
//       resolve(users);
//     })
//     .catch((error) => reject(error));
// });

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

export default setCurrentUser;
