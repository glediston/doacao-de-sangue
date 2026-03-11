

import request from "supertest";
import app from "../../../index"; // Ajuste o caminho se necessário
import { donationRepository } from "../../../repositories/donation.repository";

// 1. Criamos o Mock do repositório
jest.mock("../../../repositories/donation.repository", () => ({
  donationRepository: {
    create: jest.fn(),
    findByUser: jest.fn(),
    findLastDonation: jest.fn(),
  },
}));

// Mock dos middlewares para o teste não travar na autenticação
jest.mock("../../../middlewares/authMiddleware", () => ({
  authenticateToken: (req: any, res: any, next: any) => {
    req.userId = 123; // Injetamos um ID de teste
    next();
  }
}));

jest.mock("../../../middlewares/selfOrAdmin", () => ({
  selfOrAdmin: (req: any, res: any, next: any) => next()
}));


describe("Donation Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/donations", () => {
    it("deve registrar uma doação com sucesso", async () => {
      // 1. Preparamos o dado que o repositório "fingirá" retornar
      const mockDonation = {
        id: 1,
        donorId: 123,
        location: "Hospital Regional",
        quantity: 450
      };
      
      (donationRepository.create as jest.Mock).mockResolvedValue(mockDonation);

      // 2. Fazemos a requisição
      const response = await request(app)
        .post("/api/donations") // Rota definida no seu router
        .send({
          location: "Hospital Regional",
          quantity: 450,
          recipient: "Banco de Sangue Central"
        });

      // 3. Validações
      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockDonation);
      expect(donationRepository.create).toHaveBeenCalledWith(123, expect.any(Object));
    });
  });
});

it("deve retornar 400 se a quantidade for negativa", async () => {
      const response = await request(app)
        .post("/api/donations")
        .send({
          quantity: -100 // O schema diz .positive()
        });

      expect(response.status).toBe(400);
      // O Zod retorna um objeto com os detalhes do erro
      expect(response.body).toHaveProperty("quantity");
    });