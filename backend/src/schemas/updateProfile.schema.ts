


import { z } from "zod";

export const updateProfileSchema = z
  .object({
    name: z.string().min(3, "Nome muito curto").optional(),
    email: z.string().email("Email inválido").optional(),
    password: z
      .string()
      .min(6, "Senha deve ter no mínimo 6 caracteres")
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.name && !data.email && !data.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Envie ao menos um campo para atualização",
      });
    }
  });
