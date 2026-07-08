import type { Review, ToDo } from '../types';

/**
 * Tally review-star counts into a fixed-length array: [1★, 2★, 3★, 4★, 5★].
 * Empty or out-of-range star values are ignored.
 */
export const tallyReviewStars = (reviews: Review[]): number[] => {
  const counts = [0, 0, 0, 0, 0];
  reviews.forEach((review) => {
    const star = parseInt(review.reviewStars, 10);
    if (star >= 1 && star <= 5) {
      counts[star - 1] += 1;
    }
  });
  return counts;
};

export interface TaskCompletion {
  numberToDos: number;
  avgToDos: number;
}

/** Count completed todos and the completion ratio (0 when there are none). */
export const calcTaskCompletion = (todos: ToDo[]): TaskCompletion => {
  const numberToDos = todos.filter((item) => item.completedTime !== '').length;
  const avgToDos = todos.length ? numberToDos / todos.length : 0;
  return { numberToDos, avgToDos };
};
