import { apiRequest } from './apiClient';
import {
  calcTaskCompletion,
  tallyReviewStars,
  type TaskCompletion,
} from '../../Helper/LeaderboardDataHelper';
import type { Review, ToDo } from '../../types';

const getTaskLeaderBoards = (userId: string): Promise<TaskCompletion> =>
  apiRequest<Record<string, ToDo> | null>(
    `/todo.json?orderBy="uid"&equalTo="${userId}"`,
  ).then((data) => calcTaskCompletion(data ? Object.values(data) : []));

const getReviewLeaderBoards = (userId: string): Promise<number[]> =>
  apiRequest<Record<string, Review> | null>('/review.json').then((data) =>
    tallyReviewStars(data ? Object.values(data).filter((x) => x.uid !== userId) : []),
  );

export default {
  getTaskLeaderBoards,
  getReviewLeaderBoards,
};
