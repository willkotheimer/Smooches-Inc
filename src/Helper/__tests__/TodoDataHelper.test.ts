import { describe, it, expect } from 'vitest';
import { countTodosByTask, filterCompletedUnreviewed } from '../TodoDataHelper';
import type { ToDo } from '../../types';

const todo = (over: Partial<ToDo>): ToDo => ({
  firebaseKey: 'k',
  uid: 'u',
  taskId: 't',
  requesterId: 'r',
  requestedTime: '',
  completedTime: '',
  reviewId: '',
  status: '',
  ...over,
});

describe('countTodosByTask', () => {
  it('counts todos per taskId', () => {
    const result = countTodosByTask([
      todo({ taskId: 'a' }),
      todo({ taskId: 'a' }),
      todo({ taskId: 'b' }),
    ]);
    expect(result).toEqual([
      ['a', 2],
      ['b', 1],
    ]);
  });

  it('returns an empty array for no todos', () => {
    expect(countTodosByTask([])).toEqual([]);
  });
});

describe('filterCompletedUnreviewed', () => {
  it('keeps only todos that are completed and not yet reviewed', () => {
    const completedUnreviewed = todo({ firebaseKey: 'a', completedTime: 'x', reviewId: '' });
    const notCompleted = todo({ firebaseKey: 'b', completedTime: '', reviewId: '' });
    const alreadyReviewed = todo({ firebaseKey: 'c', completedTime: 'x', reviewId: 'r' });
    expect(
      filterCompletedUnreviewed([completedUnreviewed, notCompleted, alreadyReviewed]),
    ).toEqual([completedUnreviewed]);
  });
});
