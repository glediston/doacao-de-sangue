

import { z } from "zod";
import { Availability } from "@prisma/client";

export const getAvailableDonorsSchema = z.object({
  availability: z.nativeEnum(Availability).optional(),
});

export type GetAvailableDonorsInput = z.infer<
  typeof getAvailableDonorsSchema
>;