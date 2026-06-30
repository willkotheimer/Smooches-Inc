import 'dotenv/config';
import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import { connectToDatabase } from './db';
import { seedDatabase } from './seed';
import servicesRouter from './routes/services';
import todosRouter from './routes/todos';
import reviewsRouter from './routes/reviews';
import usersRouter from './routes/users';
import userjoinsRouter from './routes/userjoins';

const app = express();

// --- Middleware: runs on every request, top to bottom ---
// CORS lets the React app (a different origin/port) call this API from the browser.
app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:3000' }));
// Parses a JSON request body into `req.body`.
app.use(express.json());

// --- Routes ---
// A tiny health check so we can confirm the server is up independent of the DB.
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Feature routes mount here. Each resource gets its own router.
app.use('/api/services', servicesRouter);
app.use('/api/todos', todosRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/users', usersRouter);
app.use('/api/userjoins', userjoinsRouter);

// Error-handling middleware: Express recognizes it by its 4 arguments. Anything
// passed to next(err) (incl. async errors via asyncHandler) lands here.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[error]', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const PORT = Number(process.env.PORT ?? 4000);
const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017/smooches';

// Start the HTTP server first so /api/health works even before Mongo is up,
// then connect to the database (logs a clear message if Mongo isn't running yet).
app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});

// USE_MEMORY_DB=true -> spin up an in-process MongoDB (no Docker/install needed).
// Otherwise connect to the real MONGO_URI (Docker now, Cosmos later).
const useMemoryDb = process.env.USE_MEMORY_DB === 'true';

connectToDatabase(useMemoryDb ? undefined : MONGO_URI)
  .then(async () => {
    // The in-memory DB starts empty on every boot, so populate it from the seed.
    if (useMemoryDb) {
      await seedDatabase();
    }
  })
  .catch((err) => {
    console.error('[server] could not connect to MongoDB:', err.message);
  });
