

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  getAllUsers,
  updateProfile,
  updatePassword,
  deleteUser,
} from "../../controllers/userController";
import { userRepository } from "../../repositories/user.repository";

// 🔹 Mocks
jest.mock("../../repositories/user.repository", () => ({
  userRepository: {
    findAll: jest.fn(),
    updateProfile: jest.fn(),
    findById: jest.fn(),
    updatePassword: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("getAllUsers", () => {
  it("deve retornar 403 se não for admin", async () => {
    const req = {
      isAdmin: false,
      query: {},
    } as unknown as Request;

    const res = mockResponse();

    await getAllUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("deve retornar lista de usuários se for admin", async () => {
    const usersMock = [{ id: 1, name: "Admin" }];

    (userRepository.findAll as jest.Mock).mockResolvedValue(usersMock);

    const req = {
      isAdmin: true,
      query: { disponiveis: "true" },
    } as unknown as Request;

    const res = mockResponse();

    await getAllUsers(req, res);

    expect(userRepository.findAll).toHaveBeenCalledWith("true");
    expect(res.json).toHaveBeenCalledWith(usersMock);
  });
});


describe("updateProfile", () => {
  it("deve bloquear atualização se não for admin nem dono", async () => {
    const req = {
      params: { id: "2" },
      body: { name: "Novo Nome" },
      userId: 1,
      isAdmin: false,
    } as unknown as Request;

    const res = mockResponse();

    await updateProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("deve atualizar perfil com sucesso", async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue("senha-hash");

    const updatedUser = { id: 1, name: "Novo Nome" };
    (userRepository.updateProfile as jest.Mock).mockResolvedValue(updatedUser);

    const req = {
      params: { id: "1" },
      body: { name: "Novo Nome", password: "123456" },
      userId: 1,
      isAdmin: false,
    } as unknown as Request;

    const res = mockResponse();

    await updateProfile(req, res);

    expect(userRepository.updateProfile).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      message: "Usuário atualizado com sucesso",
      user: updatedUser,
    });
  });
});



describe("updatePassword", () => {
  it("deve retornar 404 se usuário não existir", async () => {
    (userRepository.findById as jest.Mock).mockResolvedValue(null);

    const req = {
      params: { id: "1" },
      body: { senhaNova: "Nova@1234" },
      userId: 1,
      isAdmin: true,
    } as unknown as Request;

    const res = mockResponse();

    await updatePassword(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("deve atualizar senha com sucesso (admin)", async () => {
    (userRepository.findById as jest.Mock).mockResolvedValue({
      id: 1,
      password: "hash-antigo",
    });

    (bcrypt.hash as jest.Mock).mockResolvedValue("hash-novo");

    const req = {
      params: { id: "1" },
      body: { senhaNova: "Nova@1234" },
      userId: 99,
      isAdmin: true,
    } as unknown as Request;

    const res = mockResponse();

    await updatePassword(req, res);

    expect(userRepository.updatePassword).toHaveBeenCalledWith(1, "hash-novo");
    expect(res.json).toHaveBeenCalledWith({
      message: "Senha atualizada com sucesso",
    });
  });
});


describe("deleteUser", () => {
  it("deve impedir exclusão sem permissão", async () => {
    const req = {
      params: { id: "2" },
      userId: 1,
      isAdmin: false,
    } as unknown as Request;

    const res = mockResponse();

    await deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("deve deletar usuário com sucesso", async () => {
    (userRepository.findById as jest.Mock).mockResolvedValue({ id: 1 });
    (userRepository.delete as jest.Mock).mockResolvedValue(undefined);

    const req = {
      params: { id: "1" },
      userId: 1,
      isAdmin: false,
    } as unknown as Request;

    const res = mockResponse();

    await deleteUser(req, res);

    expect(userRepository.delete).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith({
      message: "Usuário deletado com sucesso",
    });
  });
});
