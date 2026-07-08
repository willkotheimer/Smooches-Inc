import type { ToDo } from '../types';

/** Count todos grouped by taskId, returned as [taskId, count] pairs. */
export const countTodosByTask = (todos: ToDo[]): [string, number][] => {
  const counts: Record<string, number> = {};
  todos.forEach((todo) => {
    counts[todo.taskId] = counts[todo.taskId] ? counts[todo.taskId] + 1 : 1;
  });
  return Object.entries(counts);
};

/** Todos that have been completed but not yet reviewed. */
export const filterCompletedUnreviewed = (todos: ToDo[]): ToDo[] =>
  todos.filter((todo) => todo.completedTime !== '' && todo.reviewId === '');
