import { Request, Response } from "express";
import { deleteUser } from "../controllers/userController";
import { PrismaClient } from "@prisma/client";

// Mock do Prisma
const mockDb: any = {
  user: {
    findUnique: jest.fn(),
    delete: jest.fn(),
  },
};

// Mock do PrismaClient no controller
jest.mock("@prisma/client", () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => mockDb),
  };
});

describe("deleteUser", () => {
  it("deve deletar usuário com sucesso", async () => {
    const req = {
      params: { id: "1" },
      userId: 1,
      isAdmin: true,
    } as any as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    mockDb.user.findUnique.mockResolvedValue({ id: 1 });
    mockDb.user.delete.mockResolvedValue({});

    await deleteUser(req, res);

    expect(mockDb.user.delete).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ message: "Usuário deletado com sucesso" });
  });

  it("deve retornar 403 se acesso negado", async () => {
    const req = {
      params: { id: "2" },
      userId: 1,
      isAdmin: false,
    } as any as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Acesso negado" });
  });
});
