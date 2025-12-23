import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { getAllUsersSchema } from '../schemas/getAllUsers';
import { updateProfileSchema } from '../schemas/updateProfile.schema';
import { updatePasswordSchema } from '../schemas/updatePasswordSchema';



export const getAllUsers = (db: PrismaClient) => async (req: Request, res: Response) => {
  try {
    // Validação do query com Zod
    const parsed = getAllUsersSchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.format() });
    }

    const { disponiveis } = parsed.data;

    const users = await db.user.findMany({
      where: disponiveis === 'true' ? { isAvailable: true } : {},
      select: { id: true, name: true, email: true, isAvailable: true },
    });

    return res.json(users);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
};

export const updateProfile = (db: PrismaClient) => async (req: Request, res: Response) => {
  const userId = Number(req.params.id);

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  // ✅ 1. VALIDAR BODY PRIMEIRO
  const parsed = updateProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }

  const requestingUserId = (req as any).userId;
  const isAdmin = (req as any).isAdmin;

  // ✅ 2. DEPOIS validar permissão
  if (!isAdmin && requestingUserId !== userId) {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  try {
    const dataToUpdate: any = {};

    if (parsed.data.name) dataToUpdate.name = parsed.data.name;
    if (parsed.data.email) dataToUpdate.email = parsed.data.email;
    if (parsed.data.password) {
      dataToUpdate.password = await bcrypt.hash(parsed.data.password, 10);
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });

    return res.json({
      message: 'Usuário atualizado com sucesso',
      user: updatedUser,
    });
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao atualizar perfil' });
  }
};





export const updatePassword = (db: PrismaClient) => async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  const requestingUserId = (req as any).userId;
  const isAdmin = (req as any).isAdmin;

  // ✅ 1. Validar body com Zod
  const parsed = updatePasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }

  try {
    // ✅ 2. Buscar usuário
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // ✅ 3. Validar permissão
    if (!isAdmin && requestingUserId !== userId) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    // ✅ 4. Se não for admin, precisa confirmar senha atual
    if (!isAdmin) {
      const senhaCorreta = await bcrypt.compare(parsed.data.senhaAtual!, user.password);
      if (!senhaCorreta) {
        return res.status(401).json({ error: "Senha atual incorreta" });
      }
    }

    // ✅ 5. Hash da nova senha
    const senhaCriptografada = await bcrypt.hash(parsed.data.senhaNova, 10);

    await db.user.update({
      where: { id: userId },
      data: { password: senhaCriptografada },
    });

    return res.json({ message: "Senha atualizada com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar senha:", error);
    return res.status(500).json({ error: "Erro interno ao atualizar senha" });
  }
};



export const deleteUser = (db: PrismaClient) => async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  const requestingUserId = (req as any).userId;
  const isAdmin = (req as any).isAdmin;

  if (!isAdmin && requestingUserId !== userId) {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  try {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    await db.user.delete({ where: { id: userId } });

    return res.status(200).json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao apagar usuário' });
  }
};
