import { prisma } from "../prisma/client";

export const donationRepository = {
  async create(
    donorId: number,
    recipient?: string,
    location?: string,
    notes?: string,
    quantity: number = 450
  ) {
    return prisma.donation.create({
      data: {
        donorId,
        recipient: recipient ?? null, 
        location: location ?? null,   
        notes: notes ?? null,         
        quantity,
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
