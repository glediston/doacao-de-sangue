

import { prisma } from "../prisma/client";
import { Availability } from "@prisma/client";

export const donorRepository = {
  // Buscar doadores disponíveis (filtra pelo enum Availability)
  async findAvailable(status?: Availability) {
    return prisma.user.findMany({
      where: status ? { availability: status } : {},
      select: {
        id: true,
        name: true,
        bloodType: true,
        availability: true,
      },
    });
  },

  // Atualizar disponibilidade de um usuário
  async updateDisponibilidade(userId: number, status: Availability) {
    return prisma.user.update({
      where: { id: userId },
      data: { availability: status },
      select: {
        id: true,
        name: true,
        email: true,
        availability: true,
      },
    });
  },
};
