
import { Router } from "express";
import { getAvailableDonors, updateDisponibilidade } from "../controllers/donorController";
import { authenticateToken } from "../middlewares/authMiddleware";
import { selfOrAdmin } from '../middlewares/selfOrAdmin';

const router = Router();

router.get("/usuarios-disponiveis", authenticateToken, selfOrAdmin,getAvailableDonors);
router.put("/usuarios/:id/disponibilidade", authenticateToken,selfOrAdmin, updateDisponibilidade);

export default router;
