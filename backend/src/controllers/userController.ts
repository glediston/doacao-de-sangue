

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { updateProfileSchema, getAllUsersQuerySchema  } from "../schemas/user.schema"; // ou onde você colocou o schem

const prisma = new PrismaClient();

export const getAllUsers = (db: PrismaClient) =>async (req: Request, res: Response) => {
   
  try {
    // valida query
    const parsed = getAllUsersQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.format() });
    }

    const { disponiveis } = req.query;
    
    const users = await db.user.findMany({
      where: disponiveis === 'true' ? { isAvailable: true } : {},
      select: { id: true, name: true, email: true ,isAvailable: true
  }
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
};

export const updateProfile = (db: PrismaClient) =>async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  const requestingUserId = (req as any).userId;
  const isAdmin = (req as any).isAdmin;
  const { name, email, password } = req.body;

  if (!isAdmin && requestingUserId !== userId) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  try {

       // 2️⃣ Valida o body com Zod
    const parsed = updateProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.format() });
    }

    const { name, email, password } = parsed.data;

    const dataToUpdate: any = {};
    if (name) dataToUpdate.name = name;
    if (email) dataToUpdate.email = email;
    if (password) dataToUpdate.password = await bcrypt.hash(password, 10);

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });

    res.json({ message: 'Usuário atualizado com sucesso', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Erro ao atualizar perfil' });
  }
};



export const updatePassword =(db: PrismaClient) =>async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  const requestingUserId = (req as any).userId;
  const isAdmin = (req as any).isAdmin;
  const { senhaAtual, senhaNova } = req.body;

  if (!isAdmin && requestingUserId !== userId) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  try {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    // se não for admin, checa a senha atual
    if (!isAdmin) {
      const senhaCorreta = await bcrypt.compare(senhaAtual, user.password);
      if (!senhaCorreta) return res.status(401).json({ error: 'Senha atual incorreta' });
    }

    const senhaCriptografada = await bcrypt.hash(senhaNova, 10);

    await db.user.update({
      where: { id: userId },
      data: { password: senhaCriptografada }
    });

    res.json({ message: 'Senha atualizada com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar senha' });
  }
};

export const deleteUser =(db: PrismaClient) => async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  const requestingUserId = (req as any).userId;
  const isAdmin = (req as any).isAdmin;

  // só admin ou o próprio usuário podem deletar
  if (!isAdmin && requestingUserId !== userId) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  try {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    await db.user.delete({ where: { id: userId } });

    return res.status(200).json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao apagar usuário' });
  }
};



