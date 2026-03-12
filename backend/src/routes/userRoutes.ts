import { Router } from 'express';
import {  updateProfile,
  updatePassword,
  getAllUsers, } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { onlyAdmin } from "../middlewares/onlyAdmin"
import { selfOrAdmin } from '../middlewares/selfOrAdmin';
const router = Router();





// Qualquer usuário logado pode atualizar seu perfil
router.put('/user/:id', authenticateToken, selfOrAdmin ,updateProfile);

//atualizar somente senha
router.put('/user/:id/senha', authenticateToken,selfOrAdmin,updatePassword);


router.get("/users", authenticateToken, getAllUsers);


export default router;
