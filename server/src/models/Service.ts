import { model, InferSchemaType } from 'mongoose';
import { createSchema } from '../lib/baseSchema';

// `_id` holds the firebaseKey (see baseSchema). `uid` is the owner.
const serviceSchema = createSchema({
  uid: { type: String, required: true, index: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  offerDescription: { type: String, default: '' },
  // Offered to the partner when true; deactivating keeps it in the owner's bank.
  active: { type: Boolean, default: true },
  // 'custom' (user-created, deletable) | 'preset' (added from the template list)
  source: { type: String, default: 'custom' },
});

export type ServiceDoc = InferSchemaType<typeof serviceSchema>;
export const Service = model('Service', serviceSchema);
