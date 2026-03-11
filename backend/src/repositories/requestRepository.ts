// src/repositories/request.repository.ts
import { prisma } from "../prisma/client";
import { CreateRequestInput } from "../schemas/requests/createRequest.schema";

export const requestRepository = {
  async create(data: CreateRequestInput) {
    return prisma.requestBlood.create({
      data: {
        requester: data.requester,
        bloodType: data.bloodType,
        location: data.location,
        message: data.message ?? null,
      },
    });
  },

  async findAll() {
    return prisma.requestBlood.findMany({
      orderBy: { createdAt: "desc" },
    });
  },
};