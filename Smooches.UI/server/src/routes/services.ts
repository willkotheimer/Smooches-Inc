import { Router } from 'express';
import { Service } from '../models/Service';
import { asyncHandler } from '../lib/asyncHandler';

// A Router is a mini Express app — a group of related routes we mount under a
// base path (here, /api/services) in index.ts.
const router = Router();

// GET /api/services  -> list all services
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const services = await Service.find();
    res.json(services);
  }),
);

// GET /api/services/:id  -> one service by its MongoDB _id
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const service = await Service.findById(req.params.id);
    if (!service) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }
    res.json(service);
  }),
);

// POST /api/services  -> create (body is the new service)
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const created = await Service.create(req.body);
    res.status(201).json(created);
  }),
);

// PATCH /api/services/:id  -> partial update
router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }
    res.json(updated);
  }),
);

// DELETE /api/services/:id
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }
    res.status(204).end();
  }),
);

export default router;
