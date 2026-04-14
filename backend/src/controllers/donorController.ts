import { Response } from "express";
import { donorRepository } from "../repositories/donor.repository";
import { updateDisponibilidadeSchema,} from "../schemas/donnors/updateDisponibilidade.schema";
import { AuthRequest } from "../types/AuthRequest";
import { Availability } from "@prisma/client"; // Importe o Enum


//Lista usuários com availability = DISPONIVEL.
export const getAvailableDonors = async (req: AuthRequest, res: Response) => {
  try {
    // 1. Pegamos a string da query (ex: ?status=DISPONIVEL)
    const statusQuery = req.query.status as string;

    
    const status = Object.values(Availability).includes(statusQuery as Availability)
      ? (statusQuery as Availability)
      : Availability.DISPONIVEL;

    const donors = await donorRepository.findByStatus(status);

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