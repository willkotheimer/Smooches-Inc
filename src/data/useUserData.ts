import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAPIRequest } from './useAPIRequest';
import { apiRoutes } from './apiRoutes';
import type { User, UserJoin } from '../types';

export function useAllUsers() {
  const { get } = useAPIRequest();
  // Keyed by firebaseKey to match the existing consumers (they Object.values it).
  return useQuery<Record<string, User>>(['users'], async () => {
    const list = await get<User[]>(apiRoutes.users);
    return Object.fromEntries(list.map((u) => [u.firebaseKey, u]));
  });
}

const invalidateJoins = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries(['joinedUser']);
  queryClient.invalidateQueries(['users']);
};

export function useCreateUserJoin() {
  const { post } = useAPIRequest();
  const queryClient = useQueryClient();
  return useMutation<UserJoin, Error, UserJoin>(
    (userJoin) => post<UserJoin>(apiRoutes.userJoins, userJoin, { successMessage: 'Link request sent.' }),
    { onSuccess: () => invalidateJoins(queryClient) },
  );
}

export function useConfirmUserJoin() {
  const { patch } = useAPIRequest();
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, UserJoin>(
    (userJoin) => patch(apiRoutes.userJoin(userJoin.firebaseKey), { confirm: true }),
    { onSuccess: () => invalidateJoins(queryClient) },
  );
}

export function useDeleteUserConnect() {
  const { del } = useAPIRequest();
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, string>((firebaseKey) => del(apiRoutes.userJoin(firebaseKey)), {
    onSuccess: () => invalidateJoins(queryClient),
  });
}
