
import { Router } from 'express';
import { getAvailableDonors, updateDisponibilidade } from '../controllers/donationController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();


router.get('/usuarios-disponiveis', authenticateToken ,getAvailableDonors);

// rota para dispomibilidade do doador
router.put('/usuarios/:id/disponibilidade', authenticateToken, updateDisponibilidade);



export default router;