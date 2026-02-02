import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/AuthRequest";




export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acesso restrito ao administrador' });
  }

  next();
};
