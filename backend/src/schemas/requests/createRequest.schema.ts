import { z } from "zod";

const BloodTypes = ["A_POSITIVO", "A_NEGATIVO", "B_POSITIVO", "B_NEGATIVO", "AB_POSITIVO", "AB_NEGATIVO", "O_POSITIVO", "O_NEGATIVO"] as const;

export const createRequestSchema = z.object({
  requester: z.string().min(3),
  bloodType: z.enum(BloodTypes),
  location: z.string().min(3),
  message: z.string().optional(),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;