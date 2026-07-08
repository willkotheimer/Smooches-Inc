import { Router } from 'express';
import { User } from '../models/User';
import { asyncHandler } from '../lib/asyncHandler';

const router = Router();

// GET /api/users         -> all users
// GET /api/users?uid=xxx -> the user(s) with that Firebase Auth uid
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const filter = req.query.uid ? { uid: String(req.query.uid) } : {};
    res.json(await User.find(filter));
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  }),
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    res.status(201).json(await User.create(req.body));
  }),
);

router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(updated);
  }),
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(204).end();
  }),
);

export default router;
