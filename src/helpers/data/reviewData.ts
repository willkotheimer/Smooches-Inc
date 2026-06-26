import { apiRequest } from './apiClient';
import ToDoData from './todoData';
import type { Review } from '../../types';

const createReview = (reviewObj: Review) =>
  apiRequest<{ name: string }>('/review.json', 'POST', reviewObj).then((res) => {
    apiRequest(`/review/${res.name}.json`, 'PATCH', { firebaseKey: res.name });
    // mark the todo reviewed:
    ToDoData.markReviewed(reviewObj.toDoid, res.name);
  });

const getAllReviews = () =>
  apiRequest<Record<string, Review> | null>('/review.json').then((data) => data ?? {});

export default {
  createReview,
  getAllReviews,
};
