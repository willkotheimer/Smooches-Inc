import axios from 'axios';
import firebaseConfig from '../apiKeys';
import type { Review, ToDo } from '../../types';

const baseUrl = firebaseConfig.databaseURL;

const getTaskLeaderBoards = (userId: string) =>
  new Promise<{ numberToDos: number; avgToDos: number }>((resolve, reject) => {
    axios
      .get(`${baseUrl}/todo.json?orderBy="uid"&equalTo="${userId}"`)
      .then((response) => {
        const values = Object.values(response.data as Record<string, ToDo>);
        const numDone = values.filter((item) => item.completedTime !== '').length;
        const avgDone = numDone / values.length;
        resolve({ numberToDos: numDone, avgToDos: avgDone });
      })
      .catch((error) => reject(error));
  });

const getReviewLeaderBoards = (userId: string) =>
  new Promise<number[]>((resolve, reject) => {
    axios
      .get(`${baseUrl}/review.json`)
      .then((response) => {
        if (response.data !== null && response.data !== undefined) {
          const totArray: number[] = [];
          let one = 0;
          let two = 0;
          let three = 0;
          let four = 0;
          let five = 0;
          Object.values(response.data as Record<string, Review>)
            .filter((x) => x.uid !== userId)
            .forEach((review) => {
              if (review.reviewStars === '1') {
                one++;
              } else if (review.reviewStars === '2') {
                two++;
              } else if (review.reviewStars === '3') {
                three += 1;
              } else if (review.reviewStars === '4') {
                four += 1;
              } else if (review.reviewStars === '5') {
                five += 1;
              }
            });
          totArray.push(one, two, three, four, five);
          resolve(totArray);
        }
      })
      .catch((error) => reject(error));
  });

export default {
  getTaskLeaderBoards,
  getReviewLeaderBoards,
};
