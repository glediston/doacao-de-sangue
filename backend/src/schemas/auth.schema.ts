
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().nonempty("Nome é obrigatório"),
  email: z.string().nonempty("Email é obrigatório").email("Email inválido"),
  password: z.string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Senha deve conter letra maiúscula, minúscula, número e símbolo"
    ),
  bloodType: z.string().nonempty("O tipo sanguíneo é obrigatório"),
});

export const loginSchema = z.object({
  email: z.string().nonempty("Email é obrigatório").email("Email inválido"),
  password: z.string().nonempty("Senha é obrigatória"),
});

// Tipos inferidos do Zod para uso em Services/Controllers
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
