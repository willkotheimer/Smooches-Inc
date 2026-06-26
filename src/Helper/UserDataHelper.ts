import type { UserJoin } from '../types';

/** Join records where the given uid is either participant (user1 or user2). */
export const filterJoinedUsersByUid = (joins: UserJoin[], uid: string): UserJoin[] =>
  joins.filter((entry) => entry.user1FBKey === uid || entry.user2FBKey === uid);
