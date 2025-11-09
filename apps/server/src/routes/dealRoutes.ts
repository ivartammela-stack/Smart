// apps/server/src/routes/dealRoutes.ts

import { Router } from 'express';
import * as dealController from '../controllers/dealController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

// All endpoints require authentication (multi-tenant filtering)
router.use(authenticateJWT);

// Read endpoints
router.get('/', dealController.getAllDeals);
router.get('/company/:companyId', dealController.getDealsByCompany);
router.get('/:id', dealController.getDealById);

// Write endpoints
router.post('/', dealController.createDeal);
router.put('/:id', dealController.updateDeal);
router.delete('/:id', dealController.deleteDeal);

export default router;

