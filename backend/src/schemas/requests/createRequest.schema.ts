
import { z } from "zod";
import { BloodType } from "@prisma/client";

export const createRequestSchema = z.object({
  requester: z.string().min(3, "Nome muito curto"),
  bloodType: z.nativeEnum(BloodType),
  location: z.string().min(3, "Local inválido"),
  message: z.string().optional(),
});
