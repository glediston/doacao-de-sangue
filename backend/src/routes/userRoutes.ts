import { Router } from 'express';
import { getAllUsers, updateProfile, updateDisponibilidade} from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { isAdmin } from '../middlewares/isAdminMiddleware';

const router = Router();

// Apenas administradores podem ver todos os usuários
router.get('/users', authenticateToken, getAllUsers);

// Qualquer usuário logado pode atualizar seu perfil
router.put('/user/:id', authenticateToken, updateProfile);

// rota para dispomibilidade do doador
router.put('/user/:id/disponibilidade', authenticateToken, updateDisponibilidade);

export default router;
