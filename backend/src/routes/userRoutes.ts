

import { Router } from 'express';
import { getAllUsers } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();


router.get('/users', authenticateToken, getAllUsers);

export default router;
