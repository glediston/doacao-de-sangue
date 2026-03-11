import { Response } from "express";
import {AuthRequest} from "../types/AuthRequest"
import { updateProfileSchema } from "../schemas/user/updateProfile.schema";
import { userRepository } from "../repositories/user.repository";
import { updatePasswordSchema } from "../schemas/user/updatePasswordSchema";
import { getUsersSchema } from "../schemas/user/getUsers.schema";
import bcrypt from "bcrypt";



//Atualiza perfil (admin ou o próprio usuário).
export const updateProfile = async (req: AuthRequest, res: Response) => {
  const userId = Number(req.params.id);

  const parsed = updateProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }

  try {
    
    const userExists = await userRepository.findById(userId);
    if (!userExists) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const user = await userRepository.updateProfile(
      userId,
      parsed.data 
    );

    return res.json({
      message: "Perfil atualizado com sucesso",
      user,
    });
  } catch {
    return res.status(500).json({ error: "Erro ao atualizar perfil" });
  }
};


//Atualiza senha com validação de senha atual.
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

    // Usuário normal precisa validar senha atual
    if (req.role !== "ADMIN") {
      if (!parsed.data.senhaAtual) {
        return res.status(400).json({
          error: "Senha atual é obrigatória",
        });
      }

      const senhaCorreta = await bcrypt.compare(
        parsed.data.senhaAtual,
        user.password
      );

      if (!senhaCorreta) {
        return res.status(401).json({
          error: "Senha atual incorreta",
        });
      }
    }

    const hashed = await bcrypt.hash(parsed.data.senhaNova, 10);

    await userRepository.updatePassword(userId, hashed);

    return res.json({
      message: "Senha atualizada com sucesso",
    });
  } catch {
    return res.status(500).json({
      error: "Erro interno ao atualizar senha",
    });
  }
};


//Busca todos os usuários (com filtro opcional).
export const getAllUsers = async (req: AuthRequest, res: Response) => {
 

  // ✅ Validação Zod
  const parsed = getUsersSchema.safeParse({
    query: req.query,
  });

  if (!parsed.success) {
    return res.status(400).json(parsed.error.format());
  }

  try {
    const users = await userRepository.findAll(
      parsed.data.query.disponiveis
    );

    return res.json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return res.status(500).json({
      error: "Erro ao buscar usuários",
    });
  }
};

