import { updateDisponibilidade } from "../../controllers/donationController";
import { prismaMock } from "../mocks/prisma.mock";
import { mockResponse } from "../mocks/mockResponse";

describe("User Controller - updateDisponibilidade", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  // 🧪 1. Body inválido (isAvailable não boolean)
 it("retorna 400 se body for inválido", async () => {
  const req = {
    params: { id: "1" },
    body: { isAvailable: "sim" },
  } as any;

  const res = mockResponse();

  const handler = updateDisponibilidade(prismaMock as any);
  await handler(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    error: "Invalid input: expected boolean, received string",
  });

  expect(prismaMock.user.update).not.toHaveBeenCalled();
});

  // 🧪 2. Atualização com sucesso
  it("atualiza a disponibilidade do usuário com sucesso", async () => {
    prismaMock.user.update.mockResolvedValue({
      id: 1,
      name: "Ana",
      email: "ana@email.com",
      isAvailable: true,
    });

    const req = {
      params: { id: "1" },
      body: { isAvailable: true },
    } as any;

    const res = mockResponse();

    const handler = updateDisponibilidade(prismaMock as any);
    await handler(req, res);

    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { isAvailable: true },
    });

    expect(res.json).toHaveBeenCalledWith({
      message: "Disponibilidade atualizada com sucesso",
      user: {
        id: 1,
        name: "Ana",
        email: "ana@email.com",
        isAvailable: true,
      },
    });
  });

  // 🧪 3. Erro ao atualizar no banco
  it("retorna 400 se o banco lançar erro", async () => {
    prismaMock.user.update.mockRejectedValue(new Error("Erro no banco"));

    const req = {
      params: { id: "1" },
      body: { isAvailable: false },
    } as any;

    const res = mockResponse();

    const handler = updateDisponibilidade(prismaMock as any);
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Erro ao atualizar disponibilidade",
    });
  });
});
