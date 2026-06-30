import { Schema, Types, type SchemaDefinition } from 'mongoose';

/**
 * Builds a schema whose `_id` is a String (so it can hold the legacy Firebase
 * push-id during migration) and exposes a `firebaseKey` virtual === `_id`.
 *
 * Why: the React app addresses records by `firebaseKey` and cross-references them
 * by it (e.g. todo.taskId === service.firebaseKey). Making `_id` BE that key lets
 * the standard `findById` routes work with the keys the frontend already sends,
 * and `res.json` returns a `firebaseKey` field the frontend reads. New documents
 * get a generated id.
 */
export function createSchema(definition: SchemaDefinition) {
  const schema = new Schema(
    {
      _id: { type: String, default: () => new Types.ObjectId().toString() },
      ...definition,
    },
    {
      timestamps: true,
      id: false,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
    },
  );

  schema.virtual('firebaseKey').get(function (this: { _id: string }) {
    return this._id;
  });

  return schema;
}
