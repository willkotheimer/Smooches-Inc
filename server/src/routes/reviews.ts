import { Router } from 'express';
import { Review } from '../models/Review';
import { asyncHandler } from '../lib/asyncHandler';

const router = Router();

// GET /api/reviews         -> all reviews
// GET /api/reviews?uid=xxx -> reviews written by that uid
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const filter = req.query.uid ? { uid: String(req.query.uid) } : {};
    res.json(await Review.find(filter));
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);
    if (!review) {
      res.status(404).json({ error: 'Review not found' });
      return;
    }
    res.json(review);
  }),
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    res.status(201).json(await Review.create(req.body));
  }),
);

router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const updated = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ error: 'Review not found' });
      return;
    }
    res.json(updated);
  }),
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const deleted = await Review.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Review not found' });
      return;
    }
    res.status(204).end();
  }),
);

export default router;
