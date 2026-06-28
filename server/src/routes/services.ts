import { Router } from 'express';
import { Service } from '../models/Service';
import { asyncHandler } from '../lib/asyncHandler';

const router = Router();

// GET /api/services?uid=&active=
//   ?uid filters to one owner; ?active=true|false filters by offered state.
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const filter: Record<string, unknown> = {};
    if (req.query.uid) filter.uid = String(req.query.uid);
    if (req.query.active !== undefined) filter.active = req.query.active === 'true';
    res.json(await Service.find(filter));
  }),
);

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

router.post(
  '/',
  asyncHandler(async (req, res) => {
    res.status(201).json(await Service.create(req.body));
  }),
);

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

// DELETE — only services the user actually created (source: 'custom').
// Preset-sourced ones can be deactivated but not deleted.
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const service = await Service.findById(req.params.id);
    if (!service) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }
    if ((service as { source?: string }).source === 'preset') {
      res.status(403).json({ error: 'Preset services can be deactivated but not deleted' });
      return;
    }
    await service.deleteOne();
    res.status(204).end();
  }),
);

export default router;
