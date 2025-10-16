

import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).userId;

  if (!userId) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || !user.isAdmin) {
    return res.status(403).json({ error: 'Acesso restrito ao administrador' });
  }

  next();
};
