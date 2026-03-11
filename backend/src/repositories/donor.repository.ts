import { prisma } from "../prisma/client";
import { Availability } from "@prisma/client";

export const donorRepository = {
  // 🔒 SEMPRE retorna apenas disponíveis
  async findAvailable() {
    return prisma.user.findMany({
      where: {
        availability: Availability.DISPONIVEL,
      },
      select: {
        id: true,
        name: true,
        bloodType: true,
        availability: true,
      },
    });
  },

  async updateAvailability(userId: number, status: Availability) {
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