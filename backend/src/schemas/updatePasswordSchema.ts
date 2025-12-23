

import { z } from "zod";

export const updatePasswordSchema = z.object({
  senhaAtual: z
    .string()
    .min(6, "Senha atual deve ter no mínimo 6 caracteres")
    .optional(), // Admin não precisa enviar senha atual

  senhaNova: z
    .string()
    .min(8, "Senha nova deve ter pelo menos 8 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Senha deve conter letra maiúscula, minúscula, número e símbolo"
    ),
});
