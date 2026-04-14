import { z } from "zod";

export const BloodTypes = [
  "A_POS",
  "A_NEG",
  "B_POS",
  "B_NEG",
  "AB_POS",
  "AB_NEG",
  "O_POS",
  "O_NEG",
] as const;

export const Genders = [
  "MALE",
  "FEMALE",
  "OTHER",
] as const;

export const registerSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome muito longo")
    .trim(),

  email: z
    .string()
    .email("Email inválido")
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .max(50, "Senha muito longa")
    .regex(/[A-Z]/, "Deve conter pelo menos 1 letra maiúscula")
    .regex(/[a-z]/, "Deve conter pelo menos 1 letra minúscula")
    .regex(/[0-9]/, "Deve conter pelo menos 1 número"),

  bloodType: z.enum(BloodTypes).optional(),

  gender: z.enum(Genders, {
    message: "Gênero inválido",
  }),
});

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty("Email é obrigatório")
    .email("Email inválido")
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .nonempty("Senha é obrigatória")
    .min(6, "Senha inválida"),
});

export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;