import { prisma } from "../prisma/client";
import { Availability } from "@prisma/client";

export const donorRepository = {
  // 🔒 SEMPRE retorna apenas disponíveis
async findByStatus(status: Availability) { // Mudamos o nome para ser genérico
    return prisma.user.findMany({
      where: {
        availability: status,
      },
      select: {
        id: true,
        name: true,
        email: true,
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