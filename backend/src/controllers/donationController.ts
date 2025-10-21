
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()
// GET /usuarios-disponiveis
export const getAvailableDonors = async (req: Request, res: Response) => {
  try {
    const donors = await prisma.user.findMany({
      where: { isAvailable: true },
      select: {
        id: true,
        name: true,
        email: true,
        isAvailable: true
      }
    });
    res.json(donors);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar doadores disponíveis' });
  }
};


export const updateDisponibilidade = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  const { isAvailable } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isAvailable }
    });

    res.json({ message: 'Disponibilidade atualizada com sucesso', user: updatedUser });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar disponibilidade' });
  }
};
