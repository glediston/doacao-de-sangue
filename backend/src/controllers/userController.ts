

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllUsers = async (req: Request, res: Response) => {
   const { disponiveis } = req.query;
  try {
    const users = await prisma.user.findMany({
      where: disponiveis === 'true' ? { isAvailable: true } : {},
      select: { id: true, name: true, email: true ,isAvailable: true
  }
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  const userId = Number(req.params.id)
  const { name, email, password,  } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        password,

      },
    });

    res.json({ message: 'Perfil atualizado com sucesso', user: updatedUser });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar perfil' });
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
