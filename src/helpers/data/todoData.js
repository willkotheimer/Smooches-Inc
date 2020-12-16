import axios from 'axios';
import firebaseConfig from '../apiKeys';

const baseUrl = firebaseConfig.databaseURL;

const createToDo = toDoObj =>
  axios.post(`${baseUrl}/todo.json`, toDoObj).then(response => {
    const update = { firebaseKey: response.data.name };
    axios
      .patch(`${baseUrl}/todo/${response.data.name}.json`, update)
      .catch(error => console.warn(error));
  });

const getUsertoDos = (userId) =>
  new Promise((resolve, reject) => {
    axios
      .get(`${baseUrl}/todo.json?orderBy="uid"&equalTo="${userId}"`)
      .then(response => {
        resolve(response);
      })
      .catch(error => reject(error));
  });

  const getUserToDosArrayByUid = (userId) => 
    new Promise((resolve, reject) => {
      const myArray = [];
      axios.get(`${baseUrl}/todo.json?orderBy="uid"&equalTo="${userId}"`)
        .then((response) => {
            Object.entries(response.data).forEach((item) => {
              myArray.push(item[1]);
            });
          resolve(myArray);
        });
    }).catch((error) => console.warn(error));

  // eslint-disable-next-line
  export default {
    getUsertoDos,
    createToDo,
    getUserToDosArrayByUid
  }