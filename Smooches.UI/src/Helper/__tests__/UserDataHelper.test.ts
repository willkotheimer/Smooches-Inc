import { describe, it, expect } from 'vitest';
import { filterJoinedUsersByUid } from '../UserDataHelper';
import type { UserJoin } from '../../types';

const join = (over: Partial<UserJoin>): UserJoin => ({
  userJoinsKey: 'k',
  user1FBKey: '',
  user2FBKey: '',
  confirm: false,
  ...over,
});

describe('filterJoinedUsersByUid', () => {
  it('matches the uid as either user1 or user2', () => {
    const asUser1 = join({ userJoinsKey: 'a', user1FBKey: 'me' });
    const asUser2 = join({ userJoinsKey: 'b', user2FBKey: 'me' });
    const unrelated = join({ userJoinsKey: 'c', user1FBKey: 'x', user2FBKey: 'y' });
    expect(filterJoinedUsersByUid([asUser1, asUser2, unrelated], 'me')).toEqual([asUser1, asUser2]);
  });

  it('returns an empty array when nothing matches', () => {
    expect(filterJoinedUsersByUid([join({ user1FBKey: 'x' })], 'me')).toEqual([]);
  });
});
