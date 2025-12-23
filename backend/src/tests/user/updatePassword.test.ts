import { updatePassword } from "../../controllers/userController";
import { prismaMock } from "../mocks/prisma.mock";
import bcrypt from "bcrypt";

jest.mock("bcrypt", () => require("../mocks/bcrypt.mock"));

describe("User Controller - updatePassword", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retorna 400 se body for inválido", async () => {
    const req = {
      params: { id: "1" },
      body: { senhaNova: "123" }, // ❌ muito curta
      userId: 1,
      isAdmin: false,
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    const handler = updatePassword(prismaMock as any);
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
  });

  it("retorna 404 se usuário não existir", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const req = {
      params: { id: "1" },
      body: { senhaAtual: "123456", senhaNova: "NovaSenha@123" },
      userId: 1,
      isAdmin: false,
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    const handler = updatePassword(prismaMock as any);
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Usuário não encontrado" });
  });

  it("retorna 403 se usuário não tiver permissão", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 2, password: "hash" });

    const req = {
      params: { id: "2" },
      body: { senhaAtual: "123456", senhaNova: "NovaSenha@123" },
      userId: 1,
      isAdmin: false,
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    const handler = updatePassword(prismaMock as any);
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Acesso negado" });
  });

  it("retorna 401 se senha atual estiver incorreta", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 1, password: "hash" });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const req = {
      params: { id: "1" },
      body: { senhaAtual: "Errada123", senhaNova: "NovaSenha@123" },
      userId: 1,
      isAdmin: false,
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    const handler = updatePassword(prismaMock as any);
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Senha atual incorreta" });
  });

  it("permite admin atualizar sem senha atual", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 2, password: "hash" });
    (bcrypt.hash as jest.Mock).mockResolvedValue("nova_hash");
    prismaMock.user.update.mockResolvedValue({ id: 2 });

    const req = {
      params: { id: "2" },
      body: { senhaNova: "NovaSenha@123" },
      userId: 1,
      isAdmin: true,
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    const handler = updatePassword(prismaMock as any);
    await handler(req, res);

    expect(bcrypt.hash).toHaveBeenCalled();
    expect(prismaMock.user.update).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ message: "Senha atualizada com sucesso" });
  });

  it("atualiza senha corretamente para usuário comum", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 1, password: "hash" });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (bcrypt.hash as jest.Mock).mockResolvedValue("nova_hash");
    prismaMock.user.update.mockResolvedValue({ id: 1 });

    const req = {
      params: { id: "1" },
      body: { senhaAtual: "123456", senhaNova: "NovaSenha@123" },
      userId: 1,
      isAdmin: false,
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    const handler = updatePassword(prismaMock as any);
    await handler(req, res);

    expect(bcrypt.compare).toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalled();
    expect(prismaMock.user.update).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ message: "Senha atualizada com sucesso" });
  });
});
