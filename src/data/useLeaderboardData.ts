import { useQuery } from '@tanstack/react-query';
import { useAPIRequest } from './useAPIRequest';
import { apiRoutes } from './apiRoutes';
import { calcTaskCompletion, type TaskCompletion } from '../Helper/LeaderboardDataHelper';
import type { ToDo } from '../types';

export function useTaskLeaderboard(uid: string) {
  const { get } = useAPIRequest();
  return useQuery<TaskCompletion>(
    ['taskLeaderboard', uid],
    async () => {
      const data = await get<Record<string, ToDo> | null>(apiRoutes.todosByUid(uid));
      return calcTaskCompletion(data ? Object.values(data) : []);
    },
    { enabled: Boolean(uid) },
  );
}
