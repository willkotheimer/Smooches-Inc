import axios from 'axios';
import firebaseConfig from '../apiKeys';
import ToDoData from './todoData';

const baseUrl = firebaseConfig.databaseURL;

const createReview = reviewObj =>
axios.post(`${baseUrl}/review.json`, reviewObj).then(response => {
    console.warn(reviewObj);
  const update = { firebaseKey: response.data.name };
  axios
    .patch(`${baseUrl}/review/${response.data.name}.json`, update)
    .catch(error => console.warn(error));
    // mark the todo reviewed:
    ToDoData.markReviewed(reviewObj.toDoid, response.data.name);
});

const getAllReviews = () => new Promise((resolve, reject) => {
    axios
      .get(`${baseUrl}/review.json`)
      .then(response => {
        if (response.data !== null && response.data !== undefined ) {
        //   const myData = [];
        // Object.values(response.data).forEach((item) => {
        //   myData.push(item)
        // }) 
        resolve(response.data);
        }
      })
      .catch(error => reject(error));
  });

export default {
    createReview,
    getAllReviews
}
