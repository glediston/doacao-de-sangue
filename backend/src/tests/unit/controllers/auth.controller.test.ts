import request from "supertest";
import app from "../../../index";
import bcrypt from "bcrypt";
import { authRepository } from "../../../repositories/auth.repository";



// Mocks declarados diretamente para evitar erros de caminho
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
  });

  describe("POST /auth/register", () => {

    it("deve registrar usuário com sucesso", async () => {

      (authRepository.findByEmail as jest.Mock).mockResolvedValue(null);

      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");

      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Glediston",
          email: "glediston@gmail.com",
          password: "12345678",
          gender: "MALE",
          bloodType: "O_POS"
        });

      expect(response.status).toBe(201);

      expect(authRepository.createUser).toHaveBeenCalled();

    });

  });

});



import jwt from "jsonwebtoken";

describe("POST /auth/login", () => {

  it("deve fazer login com sucesso", async () => {

    (authRepository.findByEmail as jest.Mock).mockResolvedValue({
      id: 1,
      name: "Glediston",
      email: "glediston@gmail.com",
      password: "hashedPassword",
      role: "USER",
      availability: "DISPONIVEL",
      bloodType: "O_POS"
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    (jwt.sign as jest.Mock).mockReturnValue("fakeToken");

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "glediston@gmail.com",
        password: "123456"
      });

    expect(response.status).toBe(200);

    expect(response.body.token).toBe("fakeToken");

  });

});