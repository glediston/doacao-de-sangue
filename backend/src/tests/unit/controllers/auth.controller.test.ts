



import request from "supertest";
import app from "../../../index";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authRepository } from "../../../repositories/auth.repository";

// Mocks
jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

jest.mock("../../../repositories/auth.repository", () => ({
  authRepository: {
    findByEmail: jest.fn(),
    createUser: jest.fn(),
  },
}));

describe("Auth Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test_secret"; // Garante que o secret exista no teste
  });

  describe("POST /auth/register", () => {
    it("deve registrar usuário com sucesso", async () => {
      (authRepository.findByEmail as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
      (authRepository.createUser as jest.Mock).mockResolvedValue({ id: 1 });

      const response = await request(app)
        .post("/auth/register")
        .send({
          name: "Glediston",
          email: "glediston@gmail.com",
          password: "12345678", // Mínimo 8 caracteres conforme seu schema
          gender: "MALE",
          bloodType: "O_POS"
        });

      expect(response.status).toBe(201);
      expect(authRepository.createUser).toHaveBeenCalled();
    });
  });

  describe("POST /auth/login", () => {
    it("deve fazer login com sucesso", async () => {
      // Mock do usuário retornado pelo banco
      const mockUser = {
        id: 1,
        name: "Glediston",
        email: "glediston@gmail.com",
        password: "hashedPassword",
        role: "USER",
        availability: "DISPONIVEL",
        bloodType: "O_POS",
        gender: "MALE"
      };

      (authRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("fakeToken");

      const response = await request(app)
        .post("/auth/login")
        .send({
          email: "glediston@gmail.com",
          password: "123456"
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token", "fakeToken");
      expect(response.body.user.email).toBe("glediston@gmail.com");
    });

    it("deve retornar 400 se o email for inválido", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({
          email: "email-invalido",
          password: "123"
        });

      expect(response.status).toBe(400);
    });
  });
});