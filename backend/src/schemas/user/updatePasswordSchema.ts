
import { z } from "zod";

export const updatePasswordSchema = z.object({
  senhaAtual: z
    .string()
    .min(6, "Senha atual deve ter no mínimo 6 caracteres")
    .optional(),

  senhaNova: z
    .string()
    .min(8, "Senha nova deve ter pelo menos 8 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Senha deve conter letra maiúscula, minúscula, número e símbolo"
    ),
});

// 👇 inferência no mesmo arquivo
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;