
// selfOrAdmin

import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/AuthRequest";

export const selfOrAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const paramId = Number(req.params.id);

  if (req.role === "ADMIN") {
    return next();
  }

  if (req.userId !== paramId) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  next();
};