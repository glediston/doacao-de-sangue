



import { z } from "zod";

export const updateProfileSchema = z
  .object({
    name: z.string().min(3).optional(),
    email: z.string().email().optional(),
    availability: z.enum(["DISPONIVEL", "INDISPONIVEL"]).optional(),
  })
  .transform((data) =>
    Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    )
  );

// 👇 INFERÊNCIA NO MESMO ARQUIVO
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;