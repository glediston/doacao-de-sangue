// src/schemas/donation/createDonationSchema.ts

import { z } from "zod";

export const createDonationSchema = z.object({
  recipient: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
  quantity: z.coerce.number().positive().optional()
});

export type CreateDonationInput = z.infer<typeof createDonationSchema>;