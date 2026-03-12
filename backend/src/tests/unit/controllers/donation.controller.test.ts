

import request from "supertest";
import app from "../../../index"; 
import { donationRepository } from "../../../repositories/donation.repository";

// 1. Mock do repositório
jest.mock("../../../repositories/donation.repository", () => ({
  donationRepository: {
    create: jest.fn(),
    findByUser: jest.fn(),
    findLastDonation: jest.fn(),
  },
}));

// Mock dos middlewares
jest.mock("../../../middlewares/authMiddleware", () => ({
  authenticateToken: (req: any, res: any, next: any) => {
    req.userId = 123; 
    next();
  }
}));

jest.mock("../../../middlewares/selfOrAdmin", () => ({
  selfOrAdmin: (req: any, res: any, next: any) => next()
}));

describe("Donation Controller", () => {

  describe("POST /api/donations", () => {
    it("deve registrar uma doação com sucesso", async () => {
      const mockDonation = {
        id: 1,
        donorId: 123,
        location: "Hospital Regional",
        quantity: 450,
        recipient: "Banco de Sangue Central"
      };
      
      (donationRepository.create as jest.Mock).mockResolvedValue(mockDonation);

      const response = await request(app)
        .post("/api/donations")
        .send({
          location: "Hospital Regional",
          quantity: 450,
          recipient: "Banco de Sangue Central"
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockDonation);
      // Verifica se o repositório foi chamado com o ID 123 e os dados corretos
      expect(donationRepository.create).toHaveBeenCalledWith(123, expect.objectContaining({
        location: "Hospital Regional",
        quantity: 450
      }));
    });

    it("deve retornar 400 se a quantidade for negativa", async () => {
      const response = await request(app)
        .post("/api/donations")
        .send({
          quantity: -100 
        });

      expect(response.status).toBe(400);
      
      /**
       * CORREÇÃO AQUI: 
       * O Zod .format() retorna { quantity: { _errors: [...] } }
       * Por isso o teste anterior falhava ao procurar a propriedade direta.
       */
      expect(response.body).toHaveProperty("quantity");
      expect(response.body.quantity._errors).toContain("Too small: expected number to be >0");
    });
  });
});