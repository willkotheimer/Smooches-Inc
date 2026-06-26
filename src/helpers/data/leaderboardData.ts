import axios from 'axios';
import firebaseConfig from '../apiKeys';
import {
  calcTaskCompletion,
  tallyReviewStars,
  type TaskCompletion,
} from '../../Helper/LeaderboardDataHelper';
import type { Review, ToDo } from '../../types';

const baseUrl = firebaseConfig.databaseURL;

const getTaskLeaderBoards = (userId: string) =>
  new Promise<TaskCompletion>((resolve, reject) => {
    axios
      .get(`${baseUrl}/todo.json?orderBy="uid"&equalTo="${userId}"`)
      .then((response) => {
        resolve(calcTaskCompletion(Object.values(response.data as Record<string, ToDo>)));
      })
      .catch((error) => reject(error));
  });

const getReviewLeaderBoards = (userId: string) =>
  new Promise<number[]>((resolve, reject) => {
    axios
      .get(`${baseUrl}/review.json`)
      .then((response) => {
        if (response.data !== null && response.data !== undefined) {
          const reviews = Object.values(response.data as Record<string, Review>).filter(
            (x) => x.uid !== userId,
          );
          resolve(tallyReviewStars(reviews));
        }
      })
      .catch((error) => reject(error));
  });

export default {
  getTaskLeaderBoards,
  getReviewLeaderBoards,
};
