import { Schema, Types, type SchemaDefinition } from 'mongoose';

/**
 * Builds a schema whose `_id` is a String (so it can hold the legacy Firebase
 * push-id during migration) and exposes a per-entity key virtual === `_id`.
 *
 * Why: the React app addresses records by their own key and cross-references them
 * by it (e.g. todo.taskId === service.servicesKey). Making `_id` BE that key lets
 * the standard `findById` routes work with the keys the frontend already sends,
 * and `res.json` returns a `<keyName>` field the frontend reads. New documents
 * get a generated id.
 *
 * @param keyName the entity-specific key virtual to expose (e.g. 'servicesKey').
 */
export function createSchema(definition: SchemaDefinition, keyName: string) {
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

  schema.virtual(keyName).get(function (this: { _id: string }) {
    return this._id;
  });

  return schema;
}
