


import { z } from "zod";

export const getUsersSchema = z.object({
  query: z.object({
    disponiveis: z
      .enum(["true", "false"])
      .optional(),
  }),
});

export type GetUsersQuery = z.infer<typeof getUsersSchema>["query"];