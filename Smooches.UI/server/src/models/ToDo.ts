import { model, InferSchemaType } from 'mongoose';
import { createSchema } from '../lib/baseSchema';

const toDoSchema = createSchema({
  uid: { type: String, required: true, index: true }, // owner the task is assigned to
  taskId: String, // references a Service _id/servicesKey
  requesterId: String,
  requestedTime: String,
  completedTime: String,
  reviewId: String,
  status: String,
  hidden: Boolean,
}, 'todosKey');

export type ToDoDoc = InferSchemaType<typeof toDoSchema>;
export const ToDo = model('ToDo', toDoSchema);
