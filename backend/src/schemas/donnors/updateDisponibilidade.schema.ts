


import { z } from "zod";

export const updateDisponibilidadeSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID inválido"),
  }),
  body: z.object({
    availability: z.enum(["INDISPONIVEL", "DISPONIVEL", "PRECISANDO_DOAR"]),
  }),
});
