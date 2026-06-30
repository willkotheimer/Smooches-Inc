import { Router } from 'express';
import { UserJoin } from '../models/UserJoin';
import { asyncHandler } from '../lib/asyncHandler';

const router = Router();

// GET /api/userjoins         -> all join records
// GET /api/userjoins?uid=xxx -> joins where that uid is EITHER participant
//   ($or lets one query match user1FBKey or user2FBKey, matching getJoinedUser).
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const uid = req.query.uid ? String(req.query.uid) : undefined;
    const filter = uid ? { $or: [{ user1FBKey: uid }, { user2FBKey: uid }] } : {};
    res.json(await UserJoin.find(filter));
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const join = await UserJoin.findById(req.params.id);
    if (!join) {
      res.status(404).json({ error: 'UserJoin not found' });
      return;
    }
    res.json(join);
  }),
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    res.status(201).json(await UserJoin.create(req.body));
  }),
);

router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const updated = await UserJoin.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ error: 'UserJoin not found' });
      return;
    }
    res.json(updated);
  }),
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const deleted = await UserJoin.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'UserJoin not found' });
      return;
    }
    res.status(204).end();
  }),
);

export default router;
