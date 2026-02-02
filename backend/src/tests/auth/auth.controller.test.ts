import { Request, Response } from "express";
import {
  getAvailableDonors,
  updateDisponibilidade,
} from "../../controllers/donationController";
import { donorRepository } from "../../repositories/donation.repository";

// 🔹 Mock do repositório
jest.mock("../../repositories/donation.repository", () => ({
  donorRepository: {
    findAvailable: jest.fn(),
    updateDisponibilidade: jest.fn(),
  },
}));

const mockResponse = (): Response => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Donation Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAvailableDonors", () => {
    it("deve retornar doadores disponíveis", async () => {
      const req = {
        query: { isAvailable: "true" },
      } as unknown as Request;

      const res = mockResponse();

      const donorsMock = [
        { id: 1, name: "João", isAvailable: true },
      ];

      (donorRepository.findAvailable as jest.Mock).mockResolvedValue(donorsMock);

      await getAvailableDonors(req, res);

      expect(donorRepository.findAvailable).toHaveBeenCalledWith(true);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(donorsMock);
    });

    it("deve retornar 400 se query for inválida", async () => {
      const req = {
        query: {},
      } as unknown as Request;

      const res = mockResponse();

      await getAvailableDonors(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
    });

    it("deve retornar 500 em erro interno", async () => {
      const req = {
        query: { isAvailable: "true" },
      } as unknown as Request;

      const res = mockResponse();

      (donorRepository.findAvailable as jest.Mock).mockRejectedValue(
        new Error("DB error")
      );

      await getAvailableDonors(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Erro interno do servidor",
      });
    });
  });

  describe("updateDisponibilidade", () => {
    it("deve atualizar a disponibilidade com sucesso", async () => {
      const req = {
        params: { id: "1" },
        body: { isAvailable: "false" },
      } as unknown as Request;

      const res = mockResponse();

      const updatedUser = { id: 1, isAvailable: false };

      (donorRepository.updateDisponibilidade as jest.Mock).mockResolvedValue(
        updatedUser
      );

      await updateDisponibilidade(req, res);

      expect(donorRepository.updateDisponibilidade).toHaveBeenCalledWith(
        1,
        false
      );

      expect(res.json).toHaveBeenCalledWith({
        message: "Disponibilidade atualizada com sucesso",
        user: updatedUser,
      });
    });

    it("deve retornar 400 se dados forem inválidos", async () => {
      const req = {
        params: { id: "abc" },
        body: {},
      } as unknown as Request;

      const res = mockResponse();

      await updateDisponibilidade(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
    });

    it("deve retornar erro ao falhar atualização", async () => {
      const req = {
        params: { id: "1" },
        body: { isAvailable: "true" },
      } as unknown as Request;

      const res = mockResponse();

      (donorRepository.updateDisponibilidade as jest.Mock).mockRejectedValue(
        new Error("Erro no banco")
      );

      await updateDisponibilidade(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Erro ao atualizar disponibilidade",
      });
    });
  });
});
