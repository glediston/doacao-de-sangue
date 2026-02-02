

import { Request, Response } from "express";
import { donorRepository } from "../repositories/donor.repository";
import { getAvailableDonorsSchema } from "../schemas/donnors/getAvailableDonors.schema";
import { updateDisponibilidadeSchema } from "../schemas/donnors/updateDisponibilidade.schema";


// busca doadores disponiveis
export const getAvailableDonors = async (req: Request, res: Response) => {
  const parsed = getAvailableDonorsSchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }

  try {
    const donors = await donorRepository.findAvailable(parsed.data.availability);
    return res.status(200).json(donors);
  } catch (error) {
    console.error("Erro em getAvailableDonors:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};


//atualizar disponibilidade
export const updateDisponibilidade = async (req: Request, res: Response) => {
  const parsed = updateDisponibilidadeSchema.safeParse({
    params: req.params,
    body: req.body,
  });

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }

  const userId = Number(parsed.data.params.id);
  const { availability } = parsed.data.body;

  try {
    const updatedUser = await donorRepository.updateDisponibilidade(userId, availability);
    return res.json({
      message: "Disponibilidade atualizada com sucesso",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Erro em updateDisponibilidade:", error);
    return res.status(400).json({ error: "Erro ao atualizar disponibilidade" });
  }
};
