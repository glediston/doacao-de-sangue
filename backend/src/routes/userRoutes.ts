

import { Router } from 'express';
import { getAllUsers ,updateProfile } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();


router.get('/users', authenticateToken, getAllUsers);
router.put('/user/:id', authenticateToken, updateProfile);

export default router;
