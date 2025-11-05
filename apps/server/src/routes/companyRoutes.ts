import { Router } from 'express';
import {
  getCompanies,
  getCompany,
  createNewCompany,
  updateExistingCompany,
  removeCompany,
} from '../controllers/companyController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

// Company routes
router.get('/', getCompanies);                              // GET /api/companies (public)
router.get('/:id', getCompany);                             // GET /api/companies/:id (public)
router.post('/', authenticateJWT, createNewCompany);        // POST /api/companies (protected)
router.put('/:id', authenticateJWT, updateExistingCompany); // PUT /api/companies/:id (protected)
router.delete('/:id', authenticateJWT, removeCompany);      // DELETE /api/companies/:id (protected)

export default router;

