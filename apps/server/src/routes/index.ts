import { Router } from 'express';
import authRoutes from './authRoutes';
import companyRoutes from './companyRoutes';
import contactRoutes from './contactRoutes';
import dealRoutes from './dealRoutes';
import taskRoutes from './taskRoutes';
import userRoutes from './userRoutes';
import adminRoutes from './adminRoutes';
import reportsRoutes from './reportsRoutes';
import searchRoutes from './searchRoutes';

const router = Router();

// Authentication routes
router.use('/auth', authRoutes);

// User routes (public read)
router.use('/users', userRoutes);

// Company routes
router.use('/companies', companyRoutes);

// Contact routes
router.use('/contacts', contactRoutes);

// Deal routes
router.use('/deals', dealRoutes);

// Task routes
router.use('/tasks', taskRoutes);

// Admin routes (requires admin role)
router.use('/admin', adminRoutes);

// Reports routes
router.use('/reports', reportsRoutes);

// Search routes
router.use('/search', searchRoutes);

export default router;