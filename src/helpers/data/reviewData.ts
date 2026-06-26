import axios from 'axios';
import firebaseConfig from '../apiKeys';
import ToDoData from './todoData';
import type { Review } from '../../types';

const baseUrl = firebaseConfig.databaseURL;

const createReview = (reviewObj: Review) =>
  axios.post(`${baseUrl}/review.json`, reviewObj).then((response) => {
    const update = { firebaseKey: response.data.name };
    axios
      .patch(`${baseUrl}/review/${response.data.name}.json`, update)
      .catch((error) => console.warn(error));
    // mark the todo reviewed:
    ToDoData.markReviewed(reviewObj.toDoid, response.data.name);
  });

const getAllReviews = () =>
  new Promise<Record<string, Review>>((resolve, reject) => {
    axios
      .get(`${baseUrl}/review.json`)
      .then((response) => {
        if (response.data !== null && response.data !== undefined) {
          resolve(response.data);
        }
      })
      .catch((error) => reject(error));
  });

export default {
  createReview,
  getAllReviews,
};
