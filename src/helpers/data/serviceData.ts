import axios from 'axios';
import firebaseConfig from '../apiKeys';
import type { Service } from '../../types';

const baseUrl = firebaseConfig.databaseURL;

const getUserServices = (userId: string) =>
  new Promise((resolve, reject) => {
    axios
      .get(`${baseUrl}/services.json?orderBy="uid"&equalTo="${userId}"`)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => reject(error));
  });

const getTaskByFBKey = (fbKey: string) =>
  new Promise<Service[]>((resolve, reject) => {
    axios
      .get(`${baseUrl}/services.json`)
      .then((response) => {
        const myData: Service[] = [];
        if (response) {
          myData.push(
            Object.values(response.data as Record<string, Service>).find(
              (item) => item.firebaseKey === fbKey,
            ) as Service,
          );
        }
        resolve(myData);
      })
      .catch((error) => reject(error));
  });

const getAllServices = () =>
  new Promise<Service[]>((resolve, reject) => {
    axios
      .get(`${baseUrl}/services.json`)
      .then((response) => {
        if (response.data !== null && response.data !== undefined) {
          const myData: Service[] = [];
          Object.values(response.data as Record<string, Service>).forEach((item) => {
            myData.push(item);
          });
          resolve(myData);
        }
      })
      .catch((error) => reject(error));
  });

const createService = (serviceObj: Service) =>
  axios.post(`${baseUrl}/services.json`, serviceObj).then((response) => {
    const update = { firebaseKey: response.data.name };
    axios
      .patch(`${baseUrl}/services/${response.data.name}.json`, update)
      .catch((error) => console.warn(error));
  });

const updateService = (serviceObj: Service) =>
  new Promise((resolve) => {
    axios
      .patch(`${baseUrl}/services/${serviceObj.firebaseKey}.json`, serviceObj)
      .then((response) => {
        resolve(response.data);
      });
  });

const deleteService = (firebaseKey: string) =>
  axios.delete(`${baseUrl}/services/${firebaseKey}.json`);

export default {
  getUserServices,
  createService,
  updateService,
  deleteService,
  getTaskByFBKey,
  getAllServices,
};
