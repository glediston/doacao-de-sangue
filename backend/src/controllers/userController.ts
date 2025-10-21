

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

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

export const updatePassword = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  const { senhaAtual, senhaNova } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const senhaCorreta = await bcrypt.compare(senhaAtual, user.password);
    if (!senhaCorreta) {
      return res.status(401).json({ error: 'Senha atual incorreta' });
    }

    const senhaCriptografada = await bcrypt.hash(senhaNova, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: senhaCriptografada }
    });

    res.json({ message: 'Senha atualizada com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar senha' });
  }
};

