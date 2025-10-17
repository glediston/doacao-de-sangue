import { Router } from 'express';
import { getAllUsers, updateProfile } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { isAdmin } from '../middlewares/isAdminMiddleware';

const router = Router();

// Apenas administradores podem ver todos os usuários
router.get('/users', authenticateToken, getAllUsers);

// Qualquer usuário logado pode atualizar seu perfil
router.put('/user/:id', authenticateToken, updateProfile);

export default router;
