import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import UserData from '../helpers/data/userData';
import type { User, UserJoin } from '../types';

export function useAllUsers() {
  return useQuery<Record<string, User>>(['users'], () => UserData.getAllUsers());
}

export function useJoinedUser(uid: string) {
  return useQuery<UserJoin[]>(['joinedUser', uid], () => UserData.getJoinedUser(uid), {
    enabled: Boolean(uid),
  });
}

const invalidateJoins = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries(['joinedUser']);
};

export function useCreateUserJoin() {
  const queryClient = useQueryClient();
  return useMutation((userJoin: UserJoin) => UserData.createUserJoin(userJoin), {
    onSuccess: () => invalidateJoins(queryClient),
  });
}

export function useConfirmUserJoin() {
  const queryClient = useQueryClient();
  return useMutation((userJoin: UserJoin) => UserData.confirmUserJoin(userJoin), {
    onSuccess: () => invalidateJoins(queryClient),
  });
}

export function useDeleteUserConnect() {
  const queryClient = useQueryClient();
  return useMutation((firebaseKey: string) => UserData.deleteUserConnect(firebaseKey), {
    onSuccess: () => invalidateJoins(queryClient),
  });
}
