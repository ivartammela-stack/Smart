import express from 'express';
import { register, login } from '../controllers/authController';
import { authLimiter } from '../middleware/rateLimiter';

const router = express.Router();

// Apply strict rate limiting to auth endpoints (prevent brute-force attacks)
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);

export default router;

