import axios from 'axios';
import firebaseConfig from '../apiKeys';

const baseUrl = firebaseConfig.databaseURL;

const getTaskLeaderBoards = (userId) =>
  new Promise((resolve, reject) => {
    axios
      .get(`${baseUrl}/todo.json?orderBy="uid"&equalTo="${userId}"`)
      .then(response => {
        const numDone = Object.values(response.data).filter((item) => item.completedTime !== '').length;
        const avgDone = numDone / Object.values(response.data).length;
        resolve({ "numberToDos": numDone, "avgToDos": avgDone });
      })
      .catch(error => reject(error));
  });

  const getReviewLeaderBoards = (userId) => new Promise((resolve, reject) => {
    axios
      .get(`${baseUrl}/review.json`)
      .then(response => {
        if (response.data !== null && response.data !== undefined ) {
            const totArray = [];
            let one = 0; let two = 0; 
            let three = 0; let four = 0; let five = 0;
            Object.values(response.data)
            .filter((x) => x.uid !==userId)
            .forEach((review) => {
                if (review.reviewStars=== "1") {
                    one++;
                } else if (review.reviewStars=== "2") {
                    two++;
                } else if (review.reviewStars=== "3") {
                    three+=1
                } else if (review.reviewStars=== "4") {
                    four+=1;
                } else if (review.reviewStars=== "5") {
                    five+=1;
                }
            });
        totArray.push(one, two, three, four, five);
        resolve(totArray);
        }
      })
      .catch(error => reject(error));
  });

  // eslint-disable-next-line
  export default {
    getTaskLeaderBoards,
    getReviewLeaderBoards
  }