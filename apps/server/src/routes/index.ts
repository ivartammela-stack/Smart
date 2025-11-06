import { Router } from 'express';
import authRoutes from './authRoutes';
import companyRoutes from './companyRoutes';
import contactRoutes from './contactRoutes';
import dealRoutes from './dealRoutes';
import taskRoutes from './taskRoutes';

const router = Router();

// Authentication routes
router.use('/auth', authRoutes);

// Company routes
router.use('/companies', companyRoutes);

// Contact routes
router.use('/contacts', contactRoutes);

// Deal routes
router.use('/deals', dealRoutes);

// Task routes
router.use('/tasks', taskRoutes);

export default router;