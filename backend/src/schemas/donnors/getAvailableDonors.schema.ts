import { z } from "zod";

export const getAvailableDonorsSchema = z.object({
  // se quiser permitir query ?isAvailable=true/false
  isAvailable: z
    .string()
    .optional()
    .refine(val => val === undefined || val === "true" || val === "false", {
      message: "O campo 'isAvailable' deve ser 'true' ou 'false'",
    }),
});
