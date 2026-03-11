// src/routes/donationRoutes.ts
import { Router } from "express";
import { createDonation, getMyDonations, getMyLastDonation } from "../controllers/donationController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

// A rota final será: POST /api/donations
router.post("/", authenticateToken, createDonation);

// A rota final será: GET /api/donations/history
router.get("/history", authenticateToken, getMyDonations);

// A rota final será: GET /api/donations/last
router.get("/last", authenticateToken, getMyLastDonation);

export default router;