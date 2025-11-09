import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

// Public endpoint to list users (without password hash)
router.get('/', userController.listUsers);

// Change password (authenticated users only)
router.put('/password', authenticateJWT, userController.changePassword);

export default router;


