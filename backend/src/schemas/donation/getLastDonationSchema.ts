


import { z } from "zod";

export const getLastDonationSchema = z.object({
  userId: z
    .string()
    .regex(/^\d+$/, "O ID deve ser numérico")
    .transform((val) => Number(val)),
});
