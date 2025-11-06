import { Router } from 'express';
import authRoutes from './authRoutes';
import companyRoutes from './companyRoutes';
import contactRoutes from './contactRoutes';
import dealRoutes from './dealRoutes';

const router = Router();

// Authentication routes
router.use('/auth', authRoutes);

// Company routes
router.use('/companies', companyRoutes);

// Contact routes
router.use('/contacts', contactRoutes);

// Deal routes
router.use('/deals', dealRoutes);

export default router;