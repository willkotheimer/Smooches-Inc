import { apiRequest } from './apiClient';
import type { Service } from '../../types';

const getUserServices = (userId: string) =>
  apiRequest<Record<string, Service> | null>(
    `/services.json?orderBy="uid"&equalTo="${userId}"`,
  ).then((data) => data ?? {});

const getTaskByFBKey = (fbKey: string) =>
  apiRequest<Record<string, Service> | null>('/services.json').then((data) =>
    data ? Object.values(data).find((item) => item.firebaseKey === fbKey) : undefined,
  );

const getAllServices = () =>
  apiRequest<Record<string, Service> | null>('/services.json').then((data) =>
    data ? Object.values(data) : [],
  );

const createService = (serviceObj: Service) =>
  apiRequest<{ name: string }>('/services.json', 'POST', serviceObj).then((res) =>
    apiRequest(`/services/${res.name}.json`, 'PATCH', { firebaseKey: res.name }),
  );

const updateService = (serviceObj: Service) =>
  apiRequest<Service>(`/services/${serviceObj.firebaseKey}.json`, 'PATCH', serviceObj);

const deleteService = (firebaseKey: string) =>
  apiRequest(`/services/${firebaseKey}.json`, 'DELETE');

export default {
  getUserServices,
  createService,
  updateService,
  deleteService,
  getTaskByFBKey,
  getAllServices,
};
