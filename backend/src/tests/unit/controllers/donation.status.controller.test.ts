

// src/tests/unit/controllers/donation.controller.test.ts

import request from "supertest";
import app from "../../../index"; 
import { donationRepository } from "../../../repositories/donation.repository";
import { userRepository } from "../../../repositories/user.repository"; // Importe o user repo
import { Gender } from "@prisma/client";

// Mocks dos repositórios
jest.mock("../../../repositories/donation.repository");
jest.mock("../../../repositories/user.repository");

// Mock do middleware de autenticação
jest.mock("../../../middlewares/authMiddleware", () => ({
  authenticateToken: (req: any, res: any, next: any) => {
    req.userId = 123; 
    next();
  }
}));

describe("Donation Status - Regras de Negócio", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Use 'modern' para evitar conflitos com o Supertest
    jest.useFakeTimers({ advanceTimers: true });
    jest.setSystemTime(new Date("2024-01-01T12:00:00Z"));
  });

  afterEach(() => {
    // É crucial voltar para timers reais após cada teste
    jest.useRealTimers();
  });

  // TESTE 1: USUÁRIO QUE NUNCA DOOU
  it("deve permitir doação se o usuário não tiver histórico", async () => {
    (userRepository.findById as jest.Mock).mockResolvedValue({ id: 123, gender: Gender.MALE });
    (donationRepository.findLastDonation as jest.Mock).mockResolvedValue(null);

    const response = await request(app).get("/api/status");

    expect(response.status).toBe(200);
    expect(response.body.canDonate).toBe(true);
    expect(response.body.message).toContain("não possui doações");
  });

  // TESTE 2: HOMEM (Intervalo de 60 dias)
  it("deve bloquear homem que doou há 45 dias", async () => {
    (userRepository.findById as jest.Mock).mockResolvedValue({ id: 123, gender: Gender.MALE });
    
    // Data da doação: 45 dias antes de 01/01/2024
    const lastDate = new Date("2024-01-01T12:00:00Z");
    lastDate.setDate(lastDate.getDate() - 45);

    (donationRepository.findLastDonation as jest.Mock).mockResolvedValue({ date: lastDate });

    const response = await request(app).get("/api/status");

    expect(response.body.canDonate).toBe(false);
    expect(response.body.daysRemaining).toBe(15); // 60 - 45 = 15
    expect(response.body.requiredInterval).toBe(60);
  });

  // TESTE 3: MULHER (Intervalo de 90 dias)
  it("deve permitir mulher que doou há 91 dias", async () => {
    (userRepository.findById as jest.Mock).mockResolvedValue({ id: 123, gender: Gender.FEMALE });
    
    const lastDate = new Date("2024-01-01T12:00:00Z");
    lastDate.setDate(lastDate.getDate() - 91);

    (donationRepository.findLastDonation as jest.Mock).mockResolvedValue({ date: lastDate });

    const response = await request(app).get("/api/status");

    expect(response.body.canDonate).toBe(true);
    expect(response.body.daysRemaining).toBe(0);
    expect(response.body.requiredInterval).toBe(90);
  });
});