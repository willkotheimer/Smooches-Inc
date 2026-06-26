import axios from 'axios';
import firebaseConfig from '../apiKeys';
import { countTodosByTask, filterCompletedUnreviewed } from '../../Helper/TodoDataHelper';
import type { ToDo } from '../../types';

const baseUrl = firebaseConfig.databaseURL;

const createToDo = (toDoObj: ToDo) =>
  axios.post(`${baseUrl}/todo.json`, toDoObj).then((response) => {
    const update = { firebaseKey: response.data.name };
    axios
      .patch(`${baseUrl}/todo/${response.data.name}.json`, update)
      .catch((error) => console.warn(error));
  });

const completeTask = (firebaseKey: string, time: string | Date) =>
  new Promise((resolve, reject) => {
    axios
      .patch(`${baseUrl}/todo/${firebaseKey}.json`, { completedTime: time })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => reject(error));
  });

const hideTask = (firebaseKey: string) =>
  new Promise((resolve, reject) => {
    axios
      .patch(`${baseUrl}/todo/${firebaseKey}.json`, { hidden: true })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => reject(error));
  });

const markReviewed = (toDofirebaseKey: string, reviewFirebaseKey: string) =>
  new Promise((resolve, reject) => {
    axios
      .patch(`${baseUrl}/todo/${toDofirebaseKey}.json`, { reviewId: reviewFirebaseKey })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => reject(error));
  });

const getUsertoDos = (userId: string) =>
  new Promise((resolve, reject) => {
    axios
      .get(`${baseUrl}/todo.json?orderBy="uid"&equalTo="${userId}"`)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => reject(error));
  });

const getUserToDosArrayByUid = (userId: string) =>
  new Promise<ToDo[]>((resolve) => {
    const myArray: ToDo[] = [];
    axios
      .get(`${baseUrl}/todo.json?orderBy="uid"&equalTo="${userId}"`)
      .then((response) => {
        Object.entries(response.data as Record<string, ToDo>).forEach((item) => {
          myArray.push(item[1]);
        });
        resolve(myArray);
      });
  }).catch((error) => {
    console.warn(error);
    return [];
  });

const getCompletedToDosByUid = (otherKey: string) =>
  new Promise<ToDo[]>((resolve, reject) => {
    axios
      .get(`${baseUrl}/todo.json?orderBy="uid"&equalTo="${otherKey}"`)
      .then((response) => {
        resolve(filterCompletedUnreviewed(Object.values(response.data as Record<string, ToDo>)));
      })
      .catch((error) => reject(error));
  });

const getUserToDosCountArrayByUid = (userId: string) =>
  new Promise<[string, number][]>((resolve) => {
    axios
      .get(`${baseUrl}/todo.json?orderBy="uid"&equalTo="${userId}"`)
      .then((response) => {
        resolve(countTodosByTask(Object.values(response.data as Record<string, ToDo>)));
      });
  }).catch((error) => {
    console.warn(error);
    return [];
  });

export default {
  getUsertoDos,
  createToDo,
  getUserToDosArrayByUid,
  completeTask,
  hideTask,
  getCompletedToDosByUid,
  markReviewed,
  getUserToDosCountArrayByUid,
};
