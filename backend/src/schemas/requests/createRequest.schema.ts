import { z } from "zod";

const BloodTypes = [ "A_POS",
  "A_NEG",
  "B_POS",
  "B_NEG",
  "AB_POS",
  "AB_NEG",
  "O_POS",
  "O_NEG"] as const;

export const createRequestSchema = z.object({
  requester: z.string().min(3),
  bloodType: z.enum(BloodTypes),
  location: z.string().min(3),
  message: z.string().optional(),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;