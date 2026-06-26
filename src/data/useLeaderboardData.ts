import { useQuery } from '@tanstack/react-query';
import LeaderBoardData from '../helpers/data/leaderboardData';
import type { TaskCompletion } from '../Helper/LeaderboardDataHelper';

export function useTaskLeaderboard(uid: string) {
  return useQuery<TaskCompletion>(
    ['taskLeaderboard', uid],
    () => LeaderBoardData.getTaskLeaderBoards(uid),
    { enabled: Boolean(uid) },
  );
}
