import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/AuthRequest";


export const onlyAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.role !== "ADMIN") {
    return res.status(403).json({ error: "Acesso permitido apenas para ADMIN" });
  }

  next();
};