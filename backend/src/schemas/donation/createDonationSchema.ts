

import { z } from "zod";

export const createDonationSchema = z.object({
  donorId: z.number(),
  recipient: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
  quantity: z.number().default(450),
});

