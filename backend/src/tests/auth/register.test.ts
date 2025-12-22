

import { register } from '../../controllers/authController';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { prismaMock } from '../mocks/prisma.mock';
import bcrypt from '../mocks/bcrypt.mock';

describe('Auth Controller - register', () => {

  beforeEach(() => {
  jest.clearAllMocks();
});


  it('deve retornar 400 se o body for inválido', async () => {
    const req = mockRequest({}); // body vazio
    const res = mockResponse();

    const handler = register(prismaMock as any);
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
  });


  //email já cadastrado
  
  it('deve retornar 400 se o email já estiver cadastrado', async () => {
    // 🔹 simula que o email já existe no banco
    prismaMock.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'teste@email.com',
    });

    const req = mockRequest({
      name: 'Teste',
      email: 'teste@email.com',
      password: 'Teste@123',
      bloodType: 'O+',
    });

    const res = mockResponse();

    const handler = register(prismaMock as any);
    await handler(req, res);

    // 🔹 validações
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Email já cadastrado',
    });

    // 🔹 garante que não tentou criar usuário
    expect(prismaMock.user.create).not.toHaveBeenCalled();

    // 🔹 garante que não tentou criptografar senha
    expect(bcrypt.hash).not.toHaveBeenCalled();

});

});
