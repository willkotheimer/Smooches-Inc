import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAPIRequest } from './useAPIRequest';
import { apiRoutes } from './apiRoutes';
import type { User, UserJoin } from '../types';

export function useAllUsers() {
  const { get } = useAPIRequest();
  return useQuery<Record<string, User>>(
    ['users'],
    async () => (await get<Record<string, User> | null>(apiRoutes.users)) ?? {},
  );
}

const invalidateJoins = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries(['joinedUser']);
  queryClient.invalidateQueries(['users']);
};

export function useCreateUserJoin() {
  const { post, patch } = useAPIRequest();
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, UserJoin>(
    async (userJoin) => {
      const res = await post<{ name: string }>(apiRoutes.userJoins, userJoin, {
        successMessage: 'Link request sent.',
      });
      return patch(apiRoutes.userJoin(res.name), { firebaseKey: res.name });
    },
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
