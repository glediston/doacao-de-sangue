import { z } from "zod";
import { BloodType } from "@prisma/client";
import { Gender } from "@prisma/client";


export const registerSchema = z.object({
  name: z.string().nonempty("Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
  bloodType: z.nativeEnum(BloodType).optional(),
   gender: z.nativeEnum(Gender),
});

export const loginSchema = z.object({
   email: z.string().nonempty("Email é obrigatório").email("Email inválido"),
    password: z.string().nonempty("Senha é obrigatória"), });




// 🔥 inferência
export type RegisterDTO = z.infer<typeof registerSchema>;