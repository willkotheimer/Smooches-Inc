import type { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Express 4 does not catch errors thrown inside async route handlers, so an
 * unhandled rejection would leave the request hanging. This wrapper catches any
 * rejection and forwards it to Express's error-handling middleware via next().
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
