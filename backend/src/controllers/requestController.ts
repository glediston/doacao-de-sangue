import { Request, Response } from "express";
import { requestRepository } from "../repositories/requestRepository";
import { createRequestSchema } from "../schemas/requests/createRequest.schema";



//  a pessoa coloca que esta precisando de doaçao
export const createRequest = async (req: Request, res: Response) => {
  const parsed = createRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }

  try {
    const { requester, bloodType, location, message } = parsed.data;
    const request = await requestRepository.create(requester, bloodType, location, message);

    return res.status(201).json({
      message: "Pedido de sangue criado com sucesso",
      request,
    });
  } catch (error) {
    console.error("Erro em createRequest:", error);
    return res.status(500).json({ error: "Erro interno ao criar pedido" });
  }
};
