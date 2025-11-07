import { Router } from 'express';
import * as userController from '../controllers/userController';

const router = Router();

// Public endpoint to list users (without password hash)
router.get('/', userController.listUsers);

export default router;


