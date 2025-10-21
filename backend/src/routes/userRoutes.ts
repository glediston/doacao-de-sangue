import { Router } from 'express';
import { getAllUsers, updateProfile } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { isAdmin } from '../middlewares/isAdminMiddleware';
import { updatePassword } from '../controllers/userController';

const router = Router();

// Apenas administradores podem ver todos os usuários
router.get('/users', authenticateToken, getAllUsers);

// Qualquer usuário logado pode atualizar seu perfil
router.put('/user/:id', authenticateToken, updateProfile);

//atualizar somente senha
router.put('/user/:id/senha', authenticateToken, updatePassword);



export default router;
