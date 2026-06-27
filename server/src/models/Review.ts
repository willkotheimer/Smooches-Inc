import { model, InferSchemaType } from 'mongoose';
import { createSchema } from '../lib/baseSchema';

const reviewSchema = createSchema({
  uid: { type: String, required: true, index: true },
  serviceid: String, // references a Service _id/firebaseKey
  toDoid: String, // references a ToDo _id/firebaseKey
  reviewStars: String,
  reviewText: String,
  // Legacy mixed epoch-millis/date strings; Mongoose casts to String here.
  dateTime: String,
});

export type ReviewDoc = InferSchemaType<typeof reviewSchema>;
export const Review = model('Review', reviewSchema);
