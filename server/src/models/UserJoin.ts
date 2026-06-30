import { model, InferSchemaType } from 'mongoose';
import { createSchema } from '../lib/baseSchema';

const userJoinSchema = createSchema({
  user1FBKey: String, // a user's uid
  user2FBKey: String, // the partner's uid
  confirm: Boolean,
});

export type UserJoinDoc = InferSchemaType<typeof userJoinSchema>;
export const UserJoin = model('UserJoin', userJoinSchema);
