

import { z } from "zod";

export const getDonationHistorySchema = z.object({
  userId: z
    .string()
    .regex(/^\d+$/, "O ID deve ser numérico")
    .transform(Number),
});

export type GetDonationHistoryInput = z.infer<
  typeof getDonationHistorySchema
>;