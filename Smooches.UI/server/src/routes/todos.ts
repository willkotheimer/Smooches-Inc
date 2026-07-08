import { Router } from 'express';
import { ToDo } from '../models/ToDo';
import { asyncHandler } from '../lib/asyncHandler';

const router = Router();

// GET /api/todos          -> all todos
// GET /api/todos?uid=xxx  -> only todos owned by that uid (req.query holds ?key=value)
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const filter = req.query.uid ? { uid: String(req.query.uid) } : {};
    const todos = await ToDo.find(filter);
    res.json(todos);
  }),
);

// GET /api/todos/:id
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const todo = await ToDo.findById(req.params.id);
    if (!todo) {
      res.status(404).json({ error: 'ToDo not found' });
      return;
    }
    res.json(todo);
  }),
);

// POST /api/todos
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const created = await ToDo.create(req.body);
    res.status(201).json(created);
  }),
);

// PATCH /api/todos/:id
router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const updated = await ToDo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ error: 'ToDo not found' });
      return;
    }
    res.json(updated);
  }),
);

// DELETE /api/todos/:id
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const deleted = await ToDo.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'ToDo not found' });
      return;
    }
    res.status(204).end();
  }),
);

export default router;
