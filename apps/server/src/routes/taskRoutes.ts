// apps/server/src/routes/taskRoutes.ts

import { Router } from 'express';
import * as taskController from '../controllers/taskController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

// Public read endpoints
router.get('/', taskController.getAllTasks);
router.get('/today', taskController.getTodayTasks);              // "Täna" vaade - ENNE /:id
router.get('/company/:companyId', taskController.getTasksByCompany);
router.get('/deal/:dealId', taskController.getTasksByDeal);
router.get('/:id', taskController.getTaskById);

// Protected write endpoints
router.post('/', authenticateJWT, taskController.createTask);
router.put('/:id', authenticateJWT, taskController.updateTask);
router.delete('/:id', authenticateJWT, taskController.deleteTask);

export default router;

