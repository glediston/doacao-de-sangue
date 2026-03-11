

import { z } from "zod";

export const updateDisponibilidadeSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    availability: z.enum([
      "INDISPONIVEL",
      "DISPONIVEL",
      "PRECISANDO_DOAR",
    ]),
  }),
});

export type UpdateDisponibilidadeInput = z.infer<
  typeof updateDisponibilidadeSchema
>;