import { z } from "zod";

// Definindo os enums manualmente para evitar erro de inicialização na Vercel
const BloodTypes = ["A_POSITIVO", "A_NEGATIVO", "B_POSITIVO", "B_NEGATIVO", "AB_POSITIVO", "AB_NEGATIVO", "O_POSITIVO", "O_NEGATIVO"] as const;
const Genders = ["MASCULINO", "FEMININO", "OUTRO"] as const;

export const registerSchema = z.object({
  name: z.string().nonempty("Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
  bloodType: z.enum(BloodTypes).optional(),
  gender: z.enum(Genders),
});

export const loginSchema = z.object({
  email: z.string().nonempty("Email é obrigatório").email("Email inválido"),
  password: z.string().nonempty("Senha é obrigatória"),
});

export type RegisterDTO = z.infer<typeof registerSchema>;