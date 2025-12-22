jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));


import { register } from '../../controllers/authController';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { prismaMock } from '../mocks/prisma.mock';
import bcrypt from 'bcrypt';


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



//Usuario cadastrado com sucesso

it('deve cadastrar usuário com sucesso', async () => {
  // 🔹 email NÃO existe
  prismaMock.user.findUnique.mockResolvedValue(null);

  // 🔹 mock do bcrypt
  (bcrypt.hash as jest.Mock).mockResolvedValue('senha_hash');

  // 🔹 mock da criação do usuário
  prismaMock.user.create.mockResolvedValue({
    id: 1,
    name: 'Teste',
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

  // 🔹 valida status
  expect(res.status).toHaveBeenCalledWith(201);

  // 🔹 valida resposta
  expect(res.json).toHaveBeenCalledWith({
    message: 'Usuário cadastrado com sucesso',
  });

  // 🔹 garante que a senha foi criptografada
  expect(bcrypt.hash).toHaveBeenCalledWith('Teste@123', 10);

  // 🔹 garante que criou usuário com senha criptografada
  expect(prismaMock.user.create).toHaveBeenCalledWith({
    data: {
      name: 'Teste',
      email: 'teste@email.com',
      password: 'senha_hash',
      isAvailable: false,
      bloodType: 'O+',
    },
  });

  
});

it('deve retornar 500 se ocorrer erro interno', async () => {
  // 🔹 força erro no banco
  prismaMock.user.findUnique.mockRejectedValue(
    new Error('Erro inesperado')
  );

  const req = mockRequest({
    name: 'Teste',
    email: 'teste@email.com',
    password: 'Teste@123',
    bloodType: 'O+',
  });

  const res = mockResponse();

  const handler = register(prismaMock as any);
  await handler(req, res);

  // 🔹 valida status
  expect(res.status).toHaveBeenCalledWith(500);

  // 🔹 valida mensagem genérica
  expect(res.json).toHaveBeenCalledWith({
    error: 'Erro interno do servidor',
  });

  // 🔹 garante que não tentou criar usuário
  expect(prismaMock.user.create).not.toHaveBeenCalled();
});



});


