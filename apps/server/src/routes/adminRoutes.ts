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
router.delete('/users/:id', adminUserController.deleteUser);
router.put('/users/:id/reset-password', adminUserController.resetPassword);
router.put('/users/:id/plan', adminUserController.updateUserPlan);

export default router;


