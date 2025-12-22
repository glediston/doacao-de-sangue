import request from "supertest";        // 1
import express from "express";          // 2
import { login } from "../controllers/authController"; // 3

// 4 - Mock do Prisma
const mockDb: any = {
  user: {
    findUnique: jest.fn(),
  },
};

// 5 - Mock do bcrypt
jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));
const bcrypt = require("bcrypt");

// 6 - Mock do JWT
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "fake-token"),
}));
const jwt = require("jsonwebtoken");

// 7 - Criando mini app para testar o controller
const app = express();
app.use(express.json());
app.post("/login", login(mockDb)); // conecta o controller com o mockDb

// 8 - Começando os testes
describe("POST /login", () => {

  // 9 - Cenário de sucesso
  it("deve fazer login com sucesso", async () => {
    const fakeUser = {
      id: 1,
      name: "João Silva",
      email: "joao@email.com",
      password: "hashed-password",
      isAdmin: false,
      isAvailable: true,
    };

    mockDb.user.findUnique.mockResolvedValue(fakeUser);  // Prisma retorna usuário
    bcrypt.compare.mockResolvedValue(true);             // Senha confere

    const response = await request(app)
      .post("/login")
      .send({
        email: "joao@email.com",
        password: "Abcd1234!",  // precisa bater com a lógica do bcrypt mock
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login bem-sucedido");
    expect(response.body.token).toBe("fake-token");
    expect(response.body.user).toEqual({
      id: fakeUser.id,
      name: fakeUser.name,
      email: fakeUser.email,
      isAdmin: fakeUser.isAdmin,
      isAvailable: fakeUser.isAvailable,
    });
  });

  // 10 - Cenário: usuário não existe
  it("deve retornar 401 se usuário não existir", async () => {
    mockDb.user.findUnique.mockResolvedValue(null);

    const response = await request(app)
      .post("/login")
      .send({
        email: "naoexiste@email.com",
        password: "Abcd1234!",
      });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Credenciais inválidas");
  });

  // 11 - Cenário: senha incorreta
  it("deve retornar 401 se a senha estiver errada", async () => {
    const fakeUser = {
      id: 1,
      name: "João Silva",
      email: "joao@email.com",
      password: "hashed-password",
      isAdmin: false,
      isAvailable: true,
    };

    mockDb.user.findUnique.mockResolvedValue(fakeUser);
    bcrypt.compare.mockResolvedValue(false); // senha errada

    const response = await request(app)
      .post("/login")
      .send({
        email: "joao@email.com",
        password: "SenhaErrada123!",
      });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Credenciais inválidas");
  });

  // 12 - Cenário: validação do Zod falha
  it("deve retornar 400 se dados forem inválidos", async () => {
    const response = await request(app)
      .post("/login")
      .send({
        email: "email-invalido", // inválido
        password: "123",          // inválido
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

});
