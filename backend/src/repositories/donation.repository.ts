import { prisma } from "../prisma/client";
import { CreateDonationInput } from "../schemas/donation/createDonationSchema";

export const donationRepository = {
  async create(donorId: number, data: CreateDonationInput) {
    return prisma.donation.create({
      data: {
        donorId,
        recipient: data.recipient ?? null,
        location: data.location ?? null,
        notes: data.notes ?? null,
        quantity: data.quantity ?? 450,
      },
    });
  },

  async findByUser(donorId: number) {
    return prisma.donation.findMany({
      where: { donorId },
      orderBy: { date: "desc" },
    });
  },

  async findLastDonation(donorId: number) {
    return prisma.donation.findFirst({
      where: { donorId },
      orderBy: { date: "desc" },
    });
  },
};  

