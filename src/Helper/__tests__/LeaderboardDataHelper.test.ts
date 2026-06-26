import { describe, it, expect } from 'vitest';
import { tallyReviewStars, calcTaskCompletion } from '../LeaderboardDataHelper';
import type { Review, ToDo } from '../../types';

const review = (reviewStars: string, uid = 'u1'): Review => ({
  firebaseKey: 'k',
  uid,
  serviceid: 's',
  toDoid: 't',
  reviewStars,
  reviewText: '',
  dateTime: 0,
});

const todo = (completedTime: string): ToDo => ({
  firebaseKey: 'k',
  uid: 'u',
  taskId: 't',
  requesterId: 'r',
  requestedTime: '',
  completedTime,
  reviewId: '',
  status: '',
});

describe('tallyReviewStars', () => {
  it('counts stars into a [1..5] array', () => {
    expect(tallyReviewStars([review('1'), review('3'), review('3'), review('5')])).toEqual([
      1, 0, 2, 0, 1,
    ]);
  });

  it('ignores empty and out-of-range star values', () => {
    expect(tallyReviewStars([review(''), review('0'), review('6')])).toEqual([0, 0, 0, 0, 0]);
  });

  it('returns all zeros for no reviews', () => {
    expect(tallyReviewStars([])).toEqual([0, 0, 0, 0, 0]);
  });
});

describe('calcTaskCompletion', () => {
  it('counts completed todos and computes the ratio', () => {
    expect(calcTaskCompletion([todo('x'), todo(''), todo('y'), todo('')])).toEqual({
      numberToDos: 2,
      avgToDos: 0.5,
    });
  });

  it('handles an empty list without producing NaN', () => {
    expect(calcTaskCompletion([])).toEqual({ numberToDos: 0, avgToDos: 0 });
  });
});
