import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryServer: MongoMemoryServer | undefined;

/**
 * Connects Mongoose to MongoDB and returns the URI actually used.
 * - If `uri` is provided -> connects to that real MongoDB (Docker / Atlas / Cosmos).
 * - If `uri` is empty -> starts an in-process MongoDB (mongodb-memory-server),
 *   which needs no install. Data is ephemeral (gone when the process exits), which
 *   is fine in dev because we re-seed on startup.
 * Swapping to Cosmos later is just providing a real `uri` (+ retryWrites=false).
 */
export async function connectToDatabase(uri?: string): Promise<string> {
  let connectionUri = uri;

  if (!connectionUri) {
    memoryServer = await MongoMemoryServer.create();
    connectionUri = memoryServer.getUri();
    console.log('[db] started in-memory MongoDB (ephemeral) — no external Mongo configured');
  }

  mongoose.connection.on('connected', () => console.log('[db] connected to MongoDB'));
  mongoose.connection.on('error', (err) => console.error('[db] connection error:', err.message));
  mongoose.connection.on('disconnected', () => console.warn('[db] disconnected'));

  await mongoose.connect(connectionUri);
  return connectionUri;
}
