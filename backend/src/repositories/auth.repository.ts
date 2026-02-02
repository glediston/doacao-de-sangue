import { prisma } from "../prisma/client";
import { Availability, BloodType } from "@prisma/client";

export const authRepository = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async createUser(data: {
    name: string;
    email: string;
    password: string;
    bloodType?: BloodType; // ✅ enum
  }) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        bloodType: data.bloodType ?? null,
        availability: Availability.INDISPONIVEL,
      },
    });
  },
};
