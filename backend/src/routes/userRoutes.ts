import { Router } from 'express';
import { getAllUsers, updateProfile } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { isAdmin } from '../middlewares/isAdminMiddleware';
import { updatePassword, deleteUser} from '../controllers/userController';

const router = Router();


router.get('/users', authenticateToken, getAllUsers);


// Qualquer usuário logado pode atualizar seu perfil
router.put('/user/:id', authenticateToken, updateProfile);

//atualizar somente senha
router.put('/user/:id/senha', authenticateToken,updatePassword);


router.delete('/users/:id', authenticateToken, deleteUser)


export default router;
