/**
 * Super Admin Routes
 * 
 * Endpoints only accessible by SUPER_ADMIN role
 */

import { Router } from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import { requireSuperAdmin } from '../middleware/requireAdmin';
import * as superAdminController from '../controllers/superAdminController';

const router = Router();

// Apply auth middleware
router.use(authenticateJWT);
router.use(requireSuperAdmin); // Only SUPER_ADMIN

/**
 * GET /api/super-admin/companies
 * Get all accounts with statistics
 */
router.get('/companies', superAdminController.getCompanies);

/**
 * POST /api/super-admin/companies
 * Create new account with COMPANY_ADMIN user
 */
router.post('/companies', superAdminController.createCompany);

/**
 * PATCH /api/super-admin/companies/:id/deactivate
 * Deactivate account (soft delete)
 */
router.patch('/companies/:id/deactivate', superAdminController.deactivateAccount);

/**
 * PATCH /api/super-admin/companies/:id/activate
 * Activate account (restore)
 */
router.patch('/companies/:id/activate', superAdminController.activateAccount);

export default router;

