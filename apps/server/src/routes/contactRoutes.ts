// apps/server/src/routes/contactRoutes.ts

import { Router } from 'express';
import * as contactController from '../controllers/contactController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

// Public read endpoints
router.get('/', contactController.getAllContacts);
router.get('/company/:companyId', contactController.getContactsByCompany);  // ENNE /:id
router.get('/:id', contactController.getContactById);

// Protected write endpoints
router.post('/', authenticateJWT, contactController.createContact);
router.put('/:id', authenticateJWT, contactController.updateContact);
router.delete('/:id', authenticateJWT, contactController.deleteContact);

export default router;

