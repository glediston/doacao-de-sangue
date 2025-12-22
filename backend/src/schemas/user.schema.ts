

import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().nonempty("Nome não pode ser vazio").optional(),
  email: z.string().email("Email inválido").optional(),
  password: z.string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, 
      "Senha deve conter letra maiúscula, minúscula, número e símbolo")
    .optional(),
});


export const getAllUsersQuerySchema = z.object({
  disponiveis: z
    .string()
    .optional()
    .refine(val => val === "true" || val === "false", {
      message: "disponiveis deve ser 'true' ou 'false'",
    }),
});