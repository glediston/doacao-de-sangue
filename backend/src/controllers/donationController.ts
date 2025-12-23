
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getAvailableDonorsSchema } from "../schemas/donnors/getAvailableDonors.schema";
import { updateDisponibilidadeSchema } from "../schemas/donnors/updateDisponibilidade.schema";

const prisma = new PrismaClient()


export const getAvailableDonors =
  (prisma: PrismaClient) =>
  async (req: Request, res: Response) => {
    const { isAvailable } = req.query;

    // ✅ Validação da query
    if (
      isAvailable !== undefined &&
      isAvailable !== 'true' &&
      isAvailable !== 'false'
    ) {
      return res.status(400).json({
        error: 'Query isAvailable inválida',
      });
    }

    try {
      const users = await prisma.user.findMany({
        where:
          isAvailable === 'true'
            ? { isAvailable: true }
            : {},
        select: {
          id: true,
          name: true,
          email: true,
          isAvailable: true,
        },
      });

      return res.status(200).json(users);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'Erro interno do servidor',
      });
    }
  };


export const updateDisponibilidade =
  (db: PrismaClient) => async (req: Request, res: Response) => {
    const parsed = updateDisponibilidadeSchema.safeParse({
      params: req.params,
      body: req.body,
    });

   if (!parsed.success) {
  return res.status(400).json({
    error: parsed.error.issues[0]?.message ?? "Dados inválidos",
  });
}


    const userId = Number(parsed.data.params.id);
    const { isAvailable } = parsed.data.body;

    try {
      const updatedUser = await db.user.update({
        where: { id: userId },
        data: { isAvailable },
      });

      res.json({
        message: "Disponibilidade atualizada com sucesso",
        user: updatedUser,
      });
    } catch (error) {
      res.status(400).json({ error: "Erro ao atualizar disponibilidade" });
    }
  };
