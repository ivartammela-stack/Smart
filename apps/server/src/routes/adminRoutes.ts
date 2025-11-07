import { Router } from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/requireAdmin';
import * as adminUserController from '../controllers/adminUserController';

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticateJWT, requireAdmin);

// User management
router.get('/users', adminUserController.listUsers);
router.post('/users', adminUserController.createUser);

export default router;


