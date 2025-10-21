


import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  const { name, email, password, bloodType } = req.body;


  // Verifique se o campo bloodType foi fornecido
  if (!bloodType) {
    return res.status(400).json({ error: 'O tipo sanguíneo é obrigatório' });
  }

  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) return res.status(400).json({ error: 'Email já cadastrado' });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name, email, password: hashedPassword, isAvailable: false, bloodType
    }
  });
  res.status(201).json({ message: "Usuario cadastrado com sucesso" });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) return res.status(401).json({ error: 'Credenciais inválidas' });

  const token = jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET!, { expiresIn: '1d' });



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
