import { Response } from "express";
import { AuthRequest } from "../types/AuthRequest";
import { donationRepository } from "../repositories/donation.repository";
import { createDonationSchema } from "../schemas/donation/createDonationSchema";


//Cria um registro de doação para o usuário logado
export const createDonation = async (req: AuthRequest, res: Response) => {
  const parsed = createDonationSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json(parsed.error.format());
  }

  try {
    const donation = await donationRepository.create(
      req.userId!, // vem do middleware de auth
      parsed.data
    );

    return res.status(201).json(donation);
  } catch {
    return res.status(500).json({ error: "Erro ao registrar doação" });
  }
};


//Busca todas as doações do usuário logado.
export const getMyDonations = async (req: AuthRequest, res: Response) => {
  try {
    const donations = await donationRepository.findByUser(req.userId!);
    return res.json(donations);
  } catch {
    return res.status(500).json({ error: "Erro ao buscar doações" });
  }
};

//Busca apenas a última doação do usuário.
export const getMyLastDonation = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const donation = await donationRepository.findLastDonation(
      req.userId!
    );
    return res.json(donation);
  } catch {
    return res
      .status(500)
      .json({ error: "Erro ao buscar última doação" });
  }
};