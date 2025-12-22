jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));


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

  it('deve retornar 401 se o usuário não existir', async () => {
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
  });

});
