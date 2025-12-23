import { deleteUser } from "../../controllers/userController";
import { prismaMock } from "../mocks/prisma.mock";

describe("User Controller - deleteUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retorna 403 se não for admin nem o próprio usuário", async () => {
    const req = {
      params: { id: "2" },
      userId: 1,
      isAdmin: false,
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    const handler = deleteUser(prismaMock as any);
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Acesso negado" });
    expect(prismaMock.user.delete).not.toHaveBeenCalled();
  });

  it("retorna 404 se usuário não existir", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const req = {
      params: { id: "1" },
      userId: 1,
      isAdmin: false,
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    const handler = deleteUser(prismaMock as any);
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Usuário não encontrado" });
  });

  it("deleta usuário com sucesso (próprio usuário)", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 1 });
    prismaMock.user.delete.mockResolvedValue({ id: 1 });

    const req = {
      params: { id: "1" },
      userId: 1,
      isAdmin: false,
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    const handler = deleteUser(prismaMock as any);
    await handler(req, res);

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(prismaMock.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Usuário deletado com sucesso" });
  });

  it("deleta usuário com sucesso (admin)", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 2 });
    prismaMock.user.delete.mockResolvedValue({ id: 2 });

    const req = {
      params: { id: "2" },
      userId: 1,
      isAdmin: true,
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    const handler = deleteUser(prismaMock as any);
    await handler(req, res);

    expect(prismaMock.user.delete).toHaveBeenCalledWith({ where: { id: 2 } });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Usuário deletado com sucesso" });
  });

  it("retorna 500 se o banco lançar erro", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 1 });
    prismaMock.user.delete.mockRejectedValue(new Error("Erro no banco"));

    const req = {
      params: { id: "1" },
      userId: 1,
      isAdmin: false,
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    const handler = deleteUser(prismaMock as any);
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro ao apagar usuário" });
  });
});
