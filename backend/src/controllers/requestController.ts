// src/controllers/request.controller.ts
import { Request, Response } from "express";
import { requestRepository } from "../repositories/requestRepository";
import { createRequestSchema } from "../schemas/requests/createRequest.schema";




//Cria um pedido de sangue.
export const createRequest = async (req: Request, res: Response) => {
  const parsed = createRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    const request = await requestRepository.create(parsed.data);

    return res.status(201).json({
      message: "Pedido de sangue criado com sucesso",
      request,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Erro interno do servidor",
    });
  }
};