


import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { registerSchema, loginSchema } from "../schemas/auth.schema";

const prisma = new PrismaClient();

export const register = (db: PrismaClient) => async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }

  const { name, email, password, bloodType } = parsed.data;

  const userExists = await db.user.findUnique({ where: { email } });
  if (userExists) {
    return res.status(400).json({ error: "Email já cadastrado" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.create({
    data: { name, email, password: hashedPassword, isAvailable: false, bloodType },
  });

  res.status(201).json({ message: "Usuário cadastrado com sucesso" });
};






export const login = (db: PrismaClient) => async (req: Request, res: Response) => {
  // Validação com Zod
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }

  const { email, password } = parsed.data;

  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) return res.status(401).json({ error: 'Credenciais inválidas' });

  const token = jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET!, { expiresIn: '1h' });



  res.json({
    message: 'Login bem-sucedido', token, user: {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isAvailable: user.isAvailable
    }
  });
};
