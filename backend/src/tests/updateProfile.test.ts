import { Request, Response } from "express";
import { updateProfile } from "../controllers/userController";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const mockDb: any = {
  user: {
    update: jest.fn(),
  },
};

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockDb),
}));

jest.mock("bcrypt");

describe("updateProfile", () => {
  it("deve atualizar usuário com sucesso", async () => {
    const req = {
      params: { id: "1" },
      body: { name: "Novo Nome" },
      userId: 1,
      isAdmin: true,
    } as any as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    mockDb.user.update.mockResolvedValue({ id: 1, name: "Novo Nome" });
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed_password");

    await updateProfile(req, res);

    expect(res.json).toHaveBeenCalledWith({
      message: "Usuário atualizado com sucesso",
      user: { id: 1, name: "Novo Nome" },
    });
  });

  it("deve retornar 403 se não for admin nem dono", async () => {
    const req = { params: { id: "2" }, userId: 1, isAdmin: false } as any as Request;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as unknown as Response;

    await updateProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Acesso negado" });
  });
});
