// src/tests/users/getAllUsers.test.ts
import { getAllUsers } from '../../controllers/userController';
import { prismaMock } from '../mocks/prisma.mock';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('User Controller - getAllUsers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('retorna todos os usuários quando disponiveis não é passado', async () => {
    prismaMock.user.findMany.mockResolvedValue([{ id: 1, name: 'User', email: 'user@email.com', isAvailable: true }]);
    const req = mockRequest({}, {}, {});
    const res = mockResponse();

    await getAllUsers(prismaMock  as any)(req, res);

    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      where: {},
      select: { id: true, name: true, email: true, isAvailable: true }
    });
    expect(res.json).toHaveBeenCalledWith([{ id: 1, name: 'User', email: 'user@email.com', isAvailable: true }]);
  });

  it('retorna apenas usuários disponíveis quando disponiveis=true', async () => {
    prismaMock.user.findMany.mockResolvedValue([{ id: 1, name: 'User', email: 'user@email.com', isAvailable: true }]);
    const req = mockRequest({}, {}, { disponiveis: 'true' });
    const res = mockResponse();

    await getAllUsers(prismaMock  as any)(req, res);

    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      where: { isAvailable: true },
      select: { id: true, name: true, email: true, isAvailable: true }
    });
    expect(res.json).toHaveBeenCalledWith([{ id: 1, name: 'User', email: 'user@email.com', isAvailable: true }]);
  });

  it('retorna 500 em caso de erro', async () => {
    prismaMock.user.findMany.mockRejectedValue(new Error('Erro no banco'));
    const req = mockRequest();
    const res = mockResponse();

    await getAllUsers(prismaMock  as any)(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao buscar usuários' });
  });
});
