import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import { connectToDatabase } from './db';
import { Service } from './models/Service';
import { User } from './models/User';
import { ToDo } from './models/ToDo';
import { Review } from './models/Review';
import { UserJoin } from './models/UserJoin';

interface FirebaseExport {
  users?: Record<string, unknown>;
  services?: Record<string, unknown>;
  todo?: Record<string, unknown>;
  review?: Record<string, unknown>;
  userjoin?: Record<string, unknown>;
}

// Real export is gitignored (real emails); the demo file is committed + anonymized.
const realDataPath = fileURLToPath(new URL('../../migration/firebase-export.json', import.meta.url));
const demoDataPath = fileURLToPath(new URL('./seed-data.demo.json', import.meta.url));

function resolveSource(): { path: string; mode: 'real' | 'demo' } {
  const mode = process.env.SEED_MODE;
  if (mode === 'demo') return { path: demoDataPath, mode: 'demo' };
  if (mode === 'real') return { path: realDataPath, mode: 'real' };
  // Default: use real data if it's present locally, otherwise the committed demo.
  if (existsSync(realDataPath)) return { path: realDataPath, mode: 'real' };
  return { path: demoDataPath, mode: 'demo' };
}

// Map each record so its Mongo _id IS the push-id, keeping all cross-references
// valid. The source uses the per-entity key (e.g. `servicesKey`); legacy exports
// used `firebaseKey`, so we accept either. A blank key gets a generated id.
const toDocs = (
  obj: Record<string, unknown> | undefined,
  keyName: string,
): Record<string, unknown>[] =>
  obj
    ? Object.values(obj).map((d) => {
        const { [keyName]: entityKey, firebaseKey, ...rest } = d as Record<string, unknown>;
        const id = entityKey ?? firebaseKey;
        return id ? { _id: id, ...rest } : rest;
      })
    : [];

/** Idempotent: clears the collections and re-inserts from the chosen source. */
export async function seedDatabase(): Promise<void> {
  const { path, mode } = resolveSource();
  const data = JSON.parse(readFileSync(path, 'utf-8')) as FirebaseExport;

  await Promise.all([
    User.deleteMany({}),
    Service.deleteMany({}),
    ToDo.deleteMany({}),
    Review.deleteMany({}),
    UserJoin.deleteMany({}),
  ]);

  const [users, services, todos, reviews, joins] = await Promise.all([
    User.insertMany(toDocs(data.users, 'usersKey')),
    Service.insertMany(toDocs(data.services, 'servicesKey')),
    ToDo.insertMany(toDocs(data.todo, 'todosKey')),
    Review.insertMany(toDocs(data.review, 'reviewsKey')),
    UserJoin.insertMany(toDocs(data.userjoin, 'userJoinsKey')),
  ]);

  console.log(
    `[seed] mode=${mode} -> users:${users.length} services:${services.length} ` +
      `todos:${todos.length} reviews:${reviews.length} joins:${joins.length}`,
  );
}

// `npm run seed` — connect, seed, disconnect. Use this against a real/persistent
// DB (Docker/Cosmos). For the in-memory DB, seeding happens on server startup.
const isDirectRun = process.argv[1] === fileURLToPath(import.meta.url);
if (isDirectRun) {
  (async () => {
    const useMemoryDb = process.env.USE_MEMORY_DB === 'true';
    await connectToDatabase(useMemoryDb ? undefined : process.env.MONGO_URI);
    await seedDatabase();
    await mongoose.disconnect();
    process.exit(0);
  })().catch((err) => {
    console.error('[seed] failed:', err);
    process.exit(1);
  });
}
