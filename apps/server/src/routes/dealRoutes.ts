// apps/server/src/routes/dealRoutes.ts

import { Router } from 'express';
import * as dealController from '../controllers/dealController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

// Public read endpoints
router.get('/', dealController.getAllDeals);
router.get('/company/:companyId', dealController.getDealsByCompany);
router.get('/:id', dealController.getDealById);

// Protected write endpoints
router.post('/', authenticateJWT, dealController.createDeal);
router.put('/:id', authenticateJWT, dealController.updateDeal);
router.delete('/:id', authenticateJWT, dealController.deleteDeal);

export default router;

