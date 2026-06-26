import { apiRequest } from './apiClient';
import { countTodosByTask, filterCompletedUnreviewed } from '../../Helper/TodoDataHelper';
import type { ToDo } from '../../types';

const createToDo = (toDoObj: ToDo) =>
  apiRequest<{ name: string }>('/todo.json', 'POST', toDoObj).then((res) =>
    apiRequest(`/todo/${res.name}.json`, 'PATCH', { firebaseKey: res.name }),
  );

const completeTask = (firebaseKey: string, time: string | Date) =>
  apiRequest(`/todo/${firebaseKey}.json`, 'PATCH', { completedTime: time });

const hideTask = (firebaseKey: string) =>
  apiRequest(`/todo/${firebaseKey}.json`, 'PATCH', { hidden: true });

const markReviewed = (toDofirebaseKey: string, reviewFirebaseKey: string) =>
  apiRequest(`/todo/${toDofirebaseKey}.json`, 'PATCH', { reviewId: reviewFirebaseKey });

const getUsertoDos = (userId: string) =>
  apiRequest<Record<string, ToDo> | null>(
    `/todo.json?orderBy="uid"&equalTo="${userId}"`,
  ).then((data) => data ?? {});

const getUserToDosArrayByUid = (userId: string) =>
  apiRequest<Record<string, ToDo> | null>(
    `/todo.json?orderBy="uid"&equalTo="${userId}"`,
  ).then((data) => (data ? Object.values(data) : []));

const getCompletedToDosByUid = (otherKey: string) =>
  apiRequest<Record<string, ToDo> | null>(
    `/todo.json?orderBy="uid"&equalTo="${otherKey}"`,
  ).then((data) => filterCompletedUnreviewed(data ? Object.values(data) : []));

const getUserToDosCountArrayByUid = (userId: string) =>
  apiRequest<Record<string, ToDo> | null>(
    `/todo.json?orderBy="uid"&equalTo="${userId}"`,
  ).then((data) => countTodosByTask(data ? Object.values(data) : []));

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
