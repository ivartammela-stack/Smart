import { Router } from 'express';
import authRoutes from './authRoutes';
import companyRoutes from './companyRoutes';

const router = Router();

// Authentication routes
router.use('/auth', authRoutes);

// Company routes
router.use('/companies', companyRoutes);

export default router;