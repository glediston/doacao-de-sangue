jest.mock('bcrypt', () => require('../mocks/bcrypt.mock'));
jest.mock('jsonwebtoken', () => require('../mocks/jwt.mock'));

import { login } from '../../controllers/authController';
import { prismaMock } from '../mocks/prisma.mock';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

describe('Auth Controller - login', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 🧪 1. Body inválido
  it('retorna 400 se body for inválido', async () => {
    const req = mockRequest({});
    const res = mockResponse();

    const handler = login(prismaMock as any);
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();

    expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  // 🧪 2. Usuário não existe
  it('retorna 401 se usuário não existir', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const req = mockRequest({
      email: 'teste@email.com',
      password: 'Teste@123',
    });

    const res = mockResponse();

    const handler = login(prismaMock as any);
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Credenciais inválidas',
    });

    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  // 🧪 3. Senha inválida
  it('retorna 401 se senha estiver incorreta', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 1,
      name: 'Teste',
      email: 'teste@email.com',
      password: 'senha_hash',
      isAdmin: false,
      isAvailable: true,
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const req = mockRequest({
      email: 'teste@email.com',
      password: 'SenhaErrada',
    });

    const res = mockResponse();

    const handler = login(prismaMock as any);
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Credenciais inválidas',
    });

    expect(jwt.sign).not.toHaveBeenCalled();
  });

  // 🧪 4. Login com sucesso
  it('retorna token e dados do usuário ao logar com sucesso', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 1,
      name: 'Teste',
      email: 'teste@email.com',
      password: 'senha_hash',
      isAdmin: false,
      isAvailable: true,
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('token_fake');

    const req = mockRequest({
      email: 'teste@email.com',
      password: 'Teste@123',
    });

    const res = mockResponse();

    const handler = login(prismaMock as any);
    await handler(req, res);

    expect(jwt.sign).toHaveBeenCalled();

    expect(res.json).toHaveBeenCalledWith({
      message: 'Login bem-sucedido',
      token: 'token_fake',
      user: {
        id: 1,
        name: 'Teste',
        email: 'teste@email.com',
        isAdmin: false,
        isAvailable: true,
      },
    });
  });

  // 🧪 5. Erro no banco
  it('retorna 500 se o banco lançar erro', async () => {
    prismaMock.user.findUnique.mockRejectedValue(
      new Error('Erro no banco')
    );

    const req = mockRequest({
      email: 'teste@email.com',
      password: 'Teste@123',
    });

    const res = mockResponse();

    const handler = login(prismaMock as any);
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Erro interno do servidor',
    });
  });

  // 🧪 6. Erro no bcrypt
  it('retorna 500 se bcrypt.compare lançar erro', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 1,
      name: 'Teste',
      email: 'teste@email.com',
      password: 'senha_hash',
      isAdmin: false,
      isAvailable: true,
    });

    (bcrypt.compare as jest.Mock).mockRejectedValue(
      new Error('Erro bcrypt')
    );

    const req = mockRequest({
      email: 'teste@email.com',
      password: 'Teste@123',
    });

    const res = mockResponse();

    const handler = login(prismaMock as any);
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  // 🧪 7. Erro no JWT
  it('retorna 500 se jwt.sign lançar erro', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 1,
      name: 'Teste',
      email: 'teste@email.com',
      password: 'senha_hash',
      isAdmin: false,
      isAvailable: true,
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockImplementation(() => {
      throw new Error('Erro JWT');
    });

    const req = mockRequest({
      email: 'teste@email.com',
      password: 'Teste@123',
    });

    const res = mockResponse();

    const handler = login(prismaMock as any);
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

});
