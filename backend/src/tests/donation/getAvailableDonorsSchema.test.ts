


import { getAvailableDonors } from "../../controllers/donationController";
import { prismaMock } from "../mocks/prisma.mock";
import { mockResponse } from "../mocks/mockResponse";

describe("Donor Controller - getAvailableDonors", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  // 🧪 1. Query inválida
  it("retorna 400 se query for inválida", async () => {
    const req = {
      query: { isAvailable: "sim" },
    } as any;

    const res = mockResponse();

    const handler = getAvailableDonors(prismaMock as any);
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Query isAvailable inválida",
    });
    expect(prismaMock.user.findMany).not.toHaveBeenCalled();
  });

  // 🧪 2. Query isAvailable=true
  it("retorna lista de doadores disponíveis quando isAvailable=true", async () => {
    prismaMock.user.findMany.mockResolvedValue([
      { id: 1, name: "Ana", email: "ana@email.com", isAvailable: true },
    ]);

    const req = {
      query: { isAvailable: "true" },
    } as any;

    const res = mockResponse();

    const handler = getAvailableDonors(prismaMock as any);
    await handler(req, res);

    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      where: { isAvailable: true },
      select: { id: true, name: true, email: true, isAvailable: true },
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      { id: 1, name: "Ana", email: "ana@email.com", isAvailable: true },
    ]);
  });

  // 🧪 3. Query isAvailable=false
  it("retorna todos os usuários quando isAvailable=false", async () => {
    prismaMock.user.findMany.mockResolvedValue([
      { id: 1, name: "Ana", email: "ana@email.com", isAvailable: true },
      { id: 2, name: "Carlos", email: "carlos@email.com", isAvailable: false },
    ]);

    const req = {
      query: { isAvailable: "false" },
    } as any;

    const res = mockResponse();

    const handler = getAvailableDonors(prismaMock as any);
    await handler(req, res);

    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      where: {},
      select: { id: true, name: true, email: true, isAvailable: true },
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      { id: 1, name: "Ana", email: "ana@email.com", isAvailable: true },
      { id: 2, name: "Carlos", email: "carlos@email.com", isAvailable: false },
    ]);
  });

  // 🧪 4. Erro interno do banco
  it("retorna 500 se o banco lançar erro", async () => {
    prismaMock.user.findMany.mockRejectedValue(new Error("Erro no banco"));

    const req = {
      query: { isAvailable: "true" },
    } as any;

    const res = mockResponse();

    const handler = getAvailableDonors(prismaMock as any);
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Erro interno do servidor",
    });
  });
});
