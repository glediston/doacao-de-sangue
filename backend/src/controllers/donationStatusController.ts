

//donationStatutusController.ts

import { Response } from "express";
import { AuthRequest } from "../types/AuthRequest";
import { donationRepository } from "../repositories/donation.repository";
import { userRepository } from "../repositories/user.repository";
import { Gender } from "@prisma/client";



//Calcula se o usuário pode doar novamente.
export const getDonationStatus = async (
  req: AuthRequest,
  res: Response
) => {

  console.log("🔥 ROTA donation-status CHAMADA");
  console.log("userId:", req.userId);
  
  try {
    const userId = req.userId!;

    const user = await userRepository.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const lastDonation =
      await donationRepository.findLastDonation(userId);

    // Caso nunca tenha doado
    if (!lastDonation) {
      return res.json({
        lastDonation: null,
        canDonate: true,
        message: "Você ainda não possui doações registradas",
      });
    }

    const today = new Date();
    const lastDate = new Date(lastDonation.date);

    const diffMs = today.getTime() - lastDate.getTime();
    const daysSinceLastDonation = Math.floor(
      diffMs / (1000 * 60 * 60 * 24)
    );

    // REGRA DE NEGÓCIO
    const requiredInterval = user.gender === Gender.MALE ? 60 : 90;

    const daysRemaining = Math.max(
      requiredInterval - daysSinceLastDonation,
      0
    );

    const canDonate = daysRemaining === 0;

    return res.json({
      lastDonation: lastDonation.date,
      daysSinceLastDonation,
      requiredInterval,
      daysRemaining,
      canDonate,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Erro ao calcular status da doação",
    });
  }
};