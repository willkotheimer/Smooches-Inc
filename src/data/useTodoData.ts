import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAPIRequest } from './useAPIRequest';
import { apiRoutes } from './apiRoutes';
import { countTodosByTask, filterCompletedUnreviewed } from '../Helper/TodoDataHelper';
import type { ToDo } from '../types';

export function useUserTodos(uid: string) {
  const { get } = useAPIRequest();
  return useQuery<ToDo[]>(['todos', uid], () => get<ToDo[]>(apiRoutes.todosByUid(uid)), {
    enabled: Boolean(uid),
  });
}

export function useCompletedUnreviewed(uid: string) {
  const { get } = useAPIRequest();
  return useQuery<ToDo[]>(
    ['completedUnreviewed', uid],
    async () => filterCompletedUnreviewed(await get<ToDo[]>(apiRoutes.todosByUid(uid))),
    { enabled: Boolean(uid) },
  );
}

export function useTodoCounts(uid: string) {
  const { get } = useAPIRequest();
  return useQuery<[string, number][]>(
    ['todoCounts', uid],
    async () => countTodosByTask(await get<ToDo[]>(apiRoutes.todosByUid(uid))),
    { enabled: Boolean(uid) },
  );
}

const invalidateTodos = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries(['todos']);
  queryClient.invalidateQueries(['completedUnreviewed']);
  queryClient.invalidateQueries(['todoCounts']);
  queryClient.invalidateQueries(['taskLeaderboard']);
};

export function useCreateToDo() {
  const { post } = useAPIRequest();
  const queryClient = useQueryClient();
  return useMutation<ToDo, Error, ToDo>(
    (todo) => post<ToDo>(apiRoutes.todos, todo, { successMessage: 'Request created.' }),
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
