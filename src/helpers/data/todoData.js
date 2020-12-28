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

  const completeTask = (firebaseKey, time) =>
  new Promise((resolve, reject) => {
    axios
      .patch(`${baseUrl}/todo/${firebaseKey}.json`, {completedTime: time })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => reject(error));
  });

  const hideTask = (firebaseKey) =>
  new Promise((resolve, reject) => {
    axios
      .patch(`${baseUrl}/todo/${firebaseKey}.json`, {hidden: true })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => reject(error));
  });

  const markReviewed = (toDofirebaseKey, reviewFirebaseKey) =>
  new Promise((resolve, reject) => {
    axios
      .patch(`${baseUrl}/todo/${toDofirebaseKey}.json`, {reviewId: reviewFirebaseKey })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => reject(error));
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

    const getCompletedToDosByUid = (otherKey) => 
    new Promise((resolve, reject) => {
      const myArray = [];
      axios.get(`${baseUrl}/todo.json?orderBy="uid"&equalTo="${otherKey}"`)
        .then((response) => {
            Object.values(response.data).forEach((item) => {
              if ((item.completedTime !== "") &&
                 (item.reviewId === "")) {
                  myArray.push(item);
                 }
            });
          resolve(myArray);
        }).catch((error) => reject(error));
    })

    const getUserToDosCountArrayByUid = (userId) => 
    new Promise((resolve, reject) => {
      const counts = [];
      axios.get(`${baseUrl}/todo.json?orderBy="uid"&equalTo="${userId}"`)
        .then((response) => {
            Object.entries(response.data).forEach((item) => {
              counts[item[1].taskId] = counts[item[1].taskId] ? counts[item[1].taskId]+1 : 1
            });
          resolve(Object.entries(counts));
        });
    }).catch((error) => console.warn(error));

  // eslint-disable-next-line
  export default {
    getUsertoDos,
    createToDo,
    getUserToDosArrayByUid,
    completeTask,
    hideTask,
    getCompletedToDosByUid,
    markReviewed,
    getUserToDosCountArrayByUid
  }