// src/schemas/requests/createRequest.schema.ts
import { z } from "zod";
import { BloodType } from "@prisma/client";

export const createRequestSchema = z.object({
  requester: z.string().min(3),
  bloodType: z.nativeEnum(BloodType),
  location: z.string().min(3),
  message: z.string().optional(),
});

// 🔥 inferência automática
export type CreateRequestInput = z.infer<typeof createRequestSchema>;