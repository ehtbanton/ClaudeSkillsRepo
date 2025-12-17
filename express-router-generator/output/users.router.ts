import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth';
import { UserService } from '../services/user.service';

const router = Router();
const userService = new UserService();

// Validation schemas
const createUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
  }),
});

const updateUserSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
  }),
});

// GET /users - List all users
router.get('/', authenticate, authorize(['admin']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const users = await userService.findAll({ page: Number(page), limit: Number(limit) });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// GET /users/:id - Get user by ID
router.get('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// POST /users - Create new user
router.post('/', validateRequest(createUserSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

// PUT /users/:id - Update user
router.put('/:id', authenticate, validateRequest(updateUserSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.update(req.params.id, req.body);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// DELETE /users/:id - Delete user
router.delete('/:id', authenticate, authorize(['admin']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
