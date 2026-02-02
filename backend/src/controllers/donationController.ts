
//donationController

import { Request, Response } from "express";
import { donationRepository } from "../repositories/donation.repository";
import { createDonationSchema } from "../schemas/donation/createDonationSchema";
import { getDonationHistorySchema } from "../schemas/donation/getDonationHistorySchema";
import { getLastDonationSchema } from "../schemas/donation/getLastDonationSchema";

// Registrar doação
export const createDonation = async (req: Request, res: Response) => {
  
  const parsed = createDonationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }

  try {
  const { donorId, recipient, location, notes, quantity } = parsed.data;

   const donation = await donationRepository.create(
  donorId,
  recipient,
  location,
  notes,
  quantity
);


    return res.status(201).json({
      message: "Doação registrada com sucesso",
      donation,
    });
  } catch (error) {
    console.error("Erro em createDonation:", error);
    return res.status(500).json({ error: "Erro interno ao registrar doação" });
  }
};

// Histórico de doações
export const getDonationHistory = async (req: Request, res: Response) => {
  const parsed = getDonationHistorySchema.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }

  const donorId = parsed.data.userId;

  try {
    const donations = await donationRepository.findByUser(donorId);
    return res.json(donations);
  } catch (error) {
    console.error("Erro em getDonationHistory:", error);
    return res.status(500).json({ error: "Erro interno ao buscar histórico" });
  }
};

// Última doação
export const getLastDonation = async (req: Request, res: Response) => {
  const parsed = getLastDonationSchema.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }

  const donorId = parsed.data.userId;

  try {
    const donation = await donationRepository.findLastDonation(donorId);
    return res.json(donation);
  } catch (error) {
    console.error("Erro em getLastDonation:", error);
    return res.status(500).json({ error: "Erro interno ao buscar última doação" });
  }
};
