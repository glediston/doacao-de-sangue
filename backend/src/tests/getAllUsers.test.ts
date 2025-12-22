import { Request, Response } from "express";
import { getAllUsers } from "../controllers/userController";
import { PrismaClient } from "@prisma/client";

const mockDb: any = {
  user: {
    findMany: jest.fn(),
  },
};

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockDb),
}));

describe("getAllUsers", () => {
  it("deve retornar todos os usuários", async () => {
    const req = { query: {} } as any as Request;
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    mockDb.user.findMany.mockResolvedValue([
      { id: 1, name: "Alice", email: "alice@test.com", isAvailable: true },
    ]);

    await getAllUsers(req, res);

    expect(res.json).toHaveBeenCalledWith([
      { id: 1, name: "Alice", email: "alice@test.com", isAvailable: true },
    ]);
  });

  it("deve retornar 500 em caso de erro", async () => {
    const req = { query: {} } as any as Request;
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    mockDb.user.findMany.mockRejectedValue(new Error("Erro"));

    await getAllUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro ao buscar usuários" });
  });
});
