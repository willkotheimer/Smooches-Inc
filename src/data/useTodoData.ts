import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ToDoData from '../helpers/data/todoData';
import type { ToDo } from '../types';

export function useUserTodos(uid: string) {
  return useQuery<ToDo[]>(['todos', uid], () => ToDoData.getUserToDosArrayByUid(uid), {
    enabled: Boolean(uid),
  });
}

export function useCompletedUnreviewed(uid: string) {
  return useQuery<ToDo[]>(['completedUnreviewed', uid], () => ToDoData.getCompletedToDosByUid(uid), {
    enabled: Boolean(uid),
  });
}

export function useTodoCounts(uid: string) {
  return useQuery<[string, number][]>(
    ['todoCounts', uid],
    () => ToDoData.getUserToDosCountArrayByUid(uid),
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
  const queryClient = useQueryClient();
  return useMutation((todo: ToDo) => ToDoData.createToDo(todo), {
    onSuccess: () => invalidateTodos(queryClient),
  });
}

export function useCompleteTask() {
  const queryClient = useQueryClient();
  return useMutation(
    ({ firebaseKey, time }: { firebaseKey: string; time: string | Date }) =>
      ToDoData.completeTask(firebaseKey, time),
    { onSuccess: () => invalidateTodos(queryClient) },
  );
}

export function useHideTask() {
  const queryClient = useQueryClient();
  return useMutation((firebaseKey: string) => ToDoData.hideTask(firebaseKey), {
    onSuccess: () => invalidateTodos(queryClient),
  });
}
