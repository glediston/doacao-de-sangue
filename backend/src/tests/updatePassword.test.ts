import { Request, Response } from "express";
import { updatePassword } from "../controllers/userController";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const mockDb: any = {
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockDb),
}));

jest.mock("bcrypt");

describe("updatePassword", () => {
  it("deve atualizar senha corretamente", async () => {
    const req = {
      params: { id: "1" },
      body: { senhaAtual: "12345678A@", senhaNova: "NewPass123@" },
      userId: 1,
      isAdmin: false,
    } as any as Request;

    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as unknown as Response;

    mockDb.user.findUnique.mockResolvedValue({ id: 1, password: "hashed_senha" });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (bcrypt.hash as jest.Mock).mockResolvedValue("nova_hash");

    await updatePassword(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: "Senha atualizada com sucesso" });
  });

  it("deve retornar 403 se não for admin nem dono", async () => {
    const req = { params: { id: "2" }, body: {}, userId: 1, isAdmin: false } as any as Request;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as unknown as Response;

    await updatePassword(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Acesso negado" });
  });
});
