
import { z } from "zod";

export const getAvailableDonorsSchema = z.object({
  availability: z.enum(["DISPONIVEL", "INDISPONIVEL", "PRECISANDO_DOAR"]).optional(),
});

export type GetAvailableDonorsInput = z.infer<typeof getAvailableDonorsSchema>;