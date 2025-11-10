import express from 'express';
import { register, login } from '../controllers/authController';
import { authLimiter } from '../middleware/rateLimiter';
import { authenticateJWT, AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();

// Apply strict rate limiting to auth endpoints (prevent brute-force attacks)
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);

/**
 * GET /api/auth/check
 * Check if user is authenticated and return user info
 */
router.get('/check', authenticateJWT, (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated',
    });
  }

  res.json({
    success: true,
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      account_id: req.user.account_id,
    },
  });
});

export default router;

