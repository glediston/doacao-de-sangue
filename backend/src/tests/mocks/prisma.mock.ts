


export const prismaMock = {
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

jest.mock("@prisma/client", () => {
  return {
    PrismaClient: jest.fn(() => prismaMock),
  };
});
