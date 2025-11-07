import { Router } from 'express';
import { getSummary } from '../controllers/reportsController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.get('/summary', authenticateJWT, getSummary);

export default router;

