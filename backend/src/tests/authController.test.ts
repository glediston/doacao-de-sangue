
import { register } from '../controllers/authController';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      findUnique: jest.fn(),
      create: jest.fn()
    }
  }))
}));

const mockPrisma = new (require('@prisma/client').PrismaClient)();

describe('register', () => {
  it('deve retornar erro se bloodType não for fornecido', async () => {
    const req = {
      body: { name: 'João', email: 'joao@email.com', password: 'Senha123!' }
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    await register(req, res, mockPrisma);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        _errors: [],
        bloodType: {
          _errors: ["Invalid input: expected string, received undefined"]
        }
      }
    });
  });

  it('deve retornar erro se email já estiver cadastrado', async () => {
    const req = {
      body: {
        name: 'Ana',
        email: 'ana@email.com',
        password: 'Senha123!',
        bloodType: 'A+'
      }
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    mockPrisma.user.findUnique.mockResolvedValue({ id: 1 });

    await register(req, res, mockPrisma);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Email já cadastrado' });
  });

  it('deve cadastrar usuário com sucesso', async () => {
    const req = {
      body: {
        name: 'Maria',
        email: 'maria@email.com',
        password: 'Senha123!',
        bloodType: 'O+'
      }
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue({ id: 1 });

    jest.spyOn(bcrypt, 'hash').mockImplementation(async () => 'senha-hash');

    await register(req, res,mockPrisma);

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'maria@email.com' } });
    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: {
        name: 'Maria',
        email: 'maria@email.com',
        password: 'senha-hash',
        isAvailable: false,
        bloodType: 'O+'
      }
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuario cadastrado com sucesso' });
  });
});
