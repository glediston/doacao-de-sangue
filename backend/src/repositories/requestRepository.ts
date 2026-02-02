
import { prisma } from "../prisma/client";
import { BloodType } from "@prisma/client";

export const requestRepository = {
  async create(
    requester: string,
    bloodType: BloodType,
    location: string,
    message?: string
  ) {
    return prisma.requestBlood.create({
      data: {
        requester,
        bloodType,
        location,
        message: message ?? null,
      },
    });
  },

  async findAll() {
    return prisma.requestBlood.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  async findByBloodType(bloodType: BloodType) {
    return prisma.requestBlood.findMany({
      where: { bloodType },
    });
  },
};
