

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { isAdmin } from '../middlewares/isAdminMiddleware';
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
  const userId = Number(req.params.id);
  const requestingUserId = (req as any).userId;
  const isAdmin = (req as any).isAdmin;
  const { name, email, password } = req.body;

  if (!isAdmin && requestingUserId !== userId) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  try {
    const dataToUpdate: any = {};
    if (name) dataToUpdate.name = name;
    if (email) dataToUpdate.email = email;
    if (password) dataToUpdate.password = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });

    res.json({ message: 'Usuário atualizado com sucesso', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Erro ao atualizar perfil' });
  }
};



export const updatePassword = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  const requestingUserId = (req as any).userId;
  const isAdmin = (req as any).isAdmin;
  const { senhaAtual, senhaNova } = req.body;

  if (!isAdmin && requestingUserId !== userId) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    // se não for admin, checa a senha atual
    if (!isAdmin) {
      const senhaCorreta = await bcrypt.compare(senhaAtual, user.password);
      if (!senhaCorreta) return res.status(401).json({ error: 'Senha atual incorreta' });
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

export const deleteUser = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  const requestingUserId = (req as any).userId;
  const isAdmin = (req as any).isAdmin;

  // só admin ou o próprio usuário podem deletar
  if (!isAdmin && requestingUserId !== userId) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    await prisma.user.delete({ where: { id: userId } });

    return res.status(200).json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao apagar usuário' });
  }
};



