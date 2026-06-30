import { model, InferSchemaType } from 'mongoose';
import { createSchema } from '../lib/baseSchema';

const userSchema = createSchema({
  uid: { type: String, required: true, index: true }, // Firebase Auth uid (cross-entity join key)
  name: String,
  email: String,
  image: String,
  lastSignInTime: String,
});

export type UserDoc = InferSchemaType<typeof userSchema>;
export const User = model('User', userSchema);
