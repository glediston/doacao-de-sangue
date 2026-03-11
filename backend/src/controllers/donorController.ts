import { Response } from "express";
import { donorRepository } from "../repositories/donor.repository";
import { updateDisponibilidadeSchema,} from "../schemas/donnors/updateDisponibilidade.schema";
import { AuthRequest } from "../types/AuthRequest";


//Lista usuários com availability = DISPONIVEL.
export const getAvailableDonors = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const donors = await donorRepository.findAvailable();

    return res.json(donors);
  } catch (error) {
    console.error("Erro em getAvailableDonors:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};


//Atualiza a disponibilidade de um usuário.
export const updateDisponibilidade = async (
  req: AuthRequest,
  res: Response
) => {
  const parsed = updateDisponibilidadeSchema.safeParse({
    params: req.params,
    body: req.body,
  });

  if (!parsed.success) {
    return res.status(400).json(parsed.error.format());
  }

 
  const {
    params: { id },
    body: { availability },
  } = parsed.data;

  await donorRepository.updateAvailability(id, availability);

  return res.status(200).json({ message: "Disponibilidade atualizada" });
};