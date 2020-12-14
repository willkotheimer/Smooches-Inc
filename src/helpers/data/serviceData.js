import axios from 'axios';
import firebaseConfig from '../apiKeys';

const baseUrl = firebaseConfig.databaseURL;

const getUserServices = (userId) =>
  new Promise((resolve, reject) => {
    console.warn(`${baseUrl}/services.json?orderBy="uid"&equalTo="${userId}"`);
    axios
      .get(`${baseUrl}/services.json?orderBy="uid"&equalTo="${userId}"`)
      .then(response => {
        resolve(response);
      })
      .catch(error => reject(error));
  });

  const getTaskByFBKey = (fbKey) => new Promise((resolve, reject) => {
    axios
      .get(`${baseUrl}/services.json"`)
      .then(response => {
        const myData = [];
        if (response) {
          myData.push(response.data.find((item) => item.firebaseKey === fbKey));
        }
        resolve(response);
      })
      .catch(error => reject(error));
  });

  const createService = serviceObj =>
  axios.post(`${baseUrl}/services.json`, serviceObj).then(response => {
    const update = { firebaseKey: response.data.name };
    axios
      .patch(`${baseUrl}/services/${response.data.name}.json`, update)
      .catch(error => console.warn(error));
  });

  const updateService = serviceObj =>
  new Promise((resolve, reject) => {
    axios
      .patch(`${baseUrl}/services/${serviceObj.firebaseKey}.json`, serviceObj)
      .then(response => {
        resolve(response.data);
      });
  });

const deleteService = firebaseKey =>
  axios.delete(`${baseUrl}/services/${firebaseKey}.json`);


  export {
    getUserServices,
    createService,
    updateService,
    deleteService,
    getTaskByFBKey
  }