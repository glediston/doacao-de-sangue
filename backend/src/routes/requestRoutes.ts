import { Router } from "express";
import { createRequest } from "../controllers/requestController";
import { authenticateToken } from "../middlewares/authMiddleware";
import { selfOrAdmin } from '../middlewares/selfOrAdmin';

const router = Router();

router.post("/requests", authenticateToken, selfOrAdmin, createRequest);

export default router;
