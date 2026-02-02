import { Router } from "express";
import { createDonation, getDonationHistory, getLastDonation } from "../controllers/donationController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.post("/donations", authenticateToken, createDonation);
router.get("/donations/history/:userId", authenticateToken, getDonationHistory);
router.get("/donations/last/:userId", authenticateToken, getLastDonation);

export default router;
