import { prisma } from "../prisma/client";
import { Availability} from "@prisma/client";
import { RegisterDTO } from "../schemas/auth/auth.schema";


export const authRepository = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

 async createUser(data: RegisterDTO) {
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password,
      bloodType: data.bloodType ?? null,
      availability: Availability.INDISPONIVEL,
       gender: data.gender
    },
  });
}
}
