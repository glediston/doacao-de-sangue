import { Router } from "express";
import { createRequest } from "../controllers/requestController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.post("/requests", authenticateToken, createRequest);

export default router;
