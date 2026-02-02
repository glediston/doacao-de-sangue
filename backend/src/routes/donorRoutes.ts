
import { Router } from "express";
import { getAvailableDonors, updateDisponibilidade } from "../controllers/donorController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.get("/usuarios-disponiveis", authenticateToken, getAvailableDonors);
router.put("/usuarios/:id/disponibilidade", authenticateToken, updateDisponibilidade);

export default router;
