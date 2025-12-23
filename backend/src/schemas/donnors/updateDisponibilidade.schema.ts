


import { z } from "zod";

export const updateDisponibilidadeSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID do usuário deve ser numérico"),
  }),

  body: z.object({
    isAvailable: z
      .boolean()
      .refine(val => typeof val === "boolean", {
        message: "isAvailable deve ser boolean",
      }),
  }),
});
