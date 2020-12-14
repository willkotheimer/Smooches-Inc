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

  // eslint-disable-next-line
  export default {
    getUsertoDos,
    createToDo
  }