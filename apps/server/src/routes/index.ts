import { Router } from 'express';
import authRoutes from './authRoutes';
import companyRoutes from './companyRoutes';
import contactRoutes from './contactRoutes';

const router = Router();

// Authentication routes
router.use('/auth', authRoutes);

// Company routes
router.use('/companies', companyRoutes);

// Contact routes
router.use('/contacts', contactRoutes);

export default router;