// src/repositories/user.repository.ts
import { prisma } from "../prisma/client";
import { Prisma, Availability } from "@prisma/client";


export const userRepository = {
  async findAll(disponiveis?: string) {
    return prisma.user.findMany({
      where:
        disponiveis === "true"
          ? { availability: Availability.DISPONIVEL }
          : {},
      select: { id: true, name: true, email: true, availability: true },
    });
  },

  async findById(userId: number) {
    return prisma.user.findUnique({
      where: { id: userId },
    });
  },

  async updateProfile(userId: number, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        availability: true,
        updatedAt: true,
      },
    });
  },

  async updatePassword(userId: number, password: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { password },
    });
  },

  async delete(userId: number) {
    return prisma.user.delete({
      where: { id: userId },
    });
  },
};
