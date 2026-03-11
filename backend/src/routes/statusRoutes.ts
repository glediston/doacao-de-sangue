import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware";
import { getDonationStatus } from "../controllers/donationStatusController";


const router = Router();

router.get(
  "/status",authenticateToken, getDonationStatus
);

export default router;