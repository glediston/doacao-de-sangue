// src/controllers/user.controller.ts
import { Response } from "express";
import bcrypt from "bcrypt";
import { getAllUsersSchema } from "../schemas/user/getAllUsers";
import { updateProfileSchema } from "../schemas/user/updateProfile.schema";
import { updatePasswordSchema } from "../schemas/user/updatePasswordSchema";
import { userRepository } from "../repositories/user.repository";
import { AuthRequest} from "../types/AuthRequest"
import { prisma } from "../prisma/client";


// Listar todos os usuários (somente admin)
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    if (req.role !== 'ADMIN') {
      return res.status(403).json({ error: "Acesso restrito ao administrador" });
    }

    const parsed = getAllUsersSchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.format() });
    }

    const users = await userRepository.findAll(parsed.data.disponiveis);
    return res.json(users);
  } catch {
    return res.status(500).json({ error: "Erro ao buscar usuários" });
  }
};



// Atualizar perfil (admin ou próprio usuári
// Atualizar perfil (admin ou próprio usuário)
export const updateProfile = async (req: AuthRequest, res: Response) => {
  const userId = Number(req.params.id);

  const parsed = updateProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }

  try {
    if (req.role !== "ADMIN" && req.userId !== userId) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    const userExists = await userRepository.findById(userId);
    if (!userExists) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const user = await userRepository.updateProfile(userId, parsed.data);

    return res.json({
      message: "Perfil atualizado com sucesso",
      user,
    });
  } catch {
    return res.status(500).json({ error: "Erro ao atualizar perfil" });
  }
};



// Atualizar senha (admin ou próprio usuário)
export const updatePassword = async (req: AuthRequest, res: Response) => {
  const userId = Number(req.params.id);

  const parsed = updatePasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }

  try {
    const user = await userRepository.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    if (req.role !== 'ADMIN' && req.userId !== userId) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    if (req.role !== 'ADMIN') {
      const senhaCorreta = await bcrypt.compare(
        parsed.data.senhaAtual!,
        user.password
      );
      if (!senhaCorreta) {
        return res.status(401).json({ error: "Senha atual incorreta" });
      }
    }

    const hashed = await bcrypt.hash(parsed.data.senhaNova, 10);
    await userRepository.updatePassword(userId, hashed);

    return res.json({ message: "Senha atualizada com sucesso" });
  } catch {
    return res.status(500).json({ error: "Erro interno ao atualizar senha" });
  }
};


// Deletar usuário (admin ou próprio usuário)
export const deleteUser = async (req: AuthRequest, res: Response) => {
  const userId = Number(req.params.id);

  if (req.role !== 'ADMIN' && req.userId !== userId) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  try {
    await userRepository.delete(userId);
    return res.json({ message: "Usuário deletado com sucesso" });
  } catch {
    return res.status(500).json({ error: "Erro ao apagar usuário" });
  }
};



