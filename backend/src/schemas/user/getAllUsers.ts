
// src/schemas/user/getAllUsers.schema.ts
import { z } from "zod";

export const getAllUsersSchema = z.object({
  disponiveis: z
    .string()
    .optional()
    .refine(
      (val) => val === undefined || val === "true" || val === "false",
      {
        message: "O campo 'disponiveis' deve ser 'true' ou 'false'",
      }
    ),
});

export type GetAllUsersInput = z.infer<typeof getAllUsersSchema>;