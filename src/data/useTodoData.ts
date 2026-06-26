import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAPIRequest } from './useAPIRequest';
import { apiRoutes } from './apiRoutes';
import { countTodosByTask, filterCompletedUnreviewed } from '../Helper/TodoDataHelper';
import type { ToDo } from '../types';

export function useUserTodos(uid: string) {
  const { get } = useAPIRequest();
  return useQuery<ToDo[]>(
    ['todos', uid],
    async () => {
      const data = await get<Record<string, ToDo> | null>(apiRoutes.todosByUid(uid));
      return data ? Object.values(data) : [];
    },
    { enabled: Boolean(uid) },
  );
}

export function useCompletedUnreviewed(uid: string) {
  const { get } = useAPIRequest();
  return useQuery<ToDo[]>(
    ['completedUnreviewed', uid],
    async () => {
      const data = await get<Record<string, ToDo> | null>(apiRoutes.todosByUid(uid));
      return filterCompletedUnreviewed(data ? Object.values(data) : []);
    },
    { enabled: Boolean(uid) },
  );
}

export function useTodoCounts(uid: string) {
  const { get } = useAPIRequest();
  return useQuery<[string, number][]>(
    ['todoCounts', uid],
    async () => {
      const data = await get<Record<string, ToDo> | null>(apiRoutes.todosByUid(uid));
      return countTodosByTask(data ? Object.values(data) : []);
    },
    { enabled: Boolean(uid) },
  );
}

// Any todo write affects the lists, the per-task counts and the leaderboard.
const invalidateTodos = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries(['todos']);
  queryClient.invalidateQueries(['completedUnreviewed']);
  queryClient.invalidateQueries(['todoCounts']);
  queryClient.invalidateQueries(['taskLeaderboard']);
};

export function useCreateToDo() {
  const { post, patch } = useAPIRequest();
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, ToDo>(
    async (todo) => {
      const res = await post<{ name: string }>(apiRoutes.todos, todo, {
        successMessage: 'Request created.',
      });
      return patch(apiRoutes.todo(res.name), { firebaseKey: res.name });
    },
    { onSuccess: () => invalidateTodos(queryClient) },
  );
}

export function useCompleteTask() {
  const { patch } = useAPIRequest();
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, { firebaseKey: string; time: string | Date }>(
    ({ firebaseKey, time }) => patch(apiRoutes.todo(firebaseKey), { completedTime: time }),
    { onSuccess: () => invalidateTodos(queryClient) },
  );
}

export function useHideTask() {
  const { patch } = useAPIRequest();
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, string>(
    (firebaseKey) => patch(apiRoutes.todo(firebaseKey), { hidden: true }),
    { onSuccess: () => invalidateTodos(queryClient) },
  );
}
