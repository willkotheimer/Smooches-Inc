import { model, InferSchemaType } from 'mongoose';
import { createSchema } from '../lib/baseSchema';

// `_id` holds the firebaseKey (see baseSchema). `uid` is the owner.
const serviceSchema = createSchema({
  uid: { type: String, required: true, index: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  offerDescription: { type: String, default: '' },
});

export type ServiceDoc = InferSchemaType<typeof serviceSchema>;
export const Service = model('Service', serviceSchema);
