

import { getAllUsers } from '../../controllers/userController';
import { prismaMock } from '../mocks/prisma.mock';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('User Controller - getAllUsers', () => {
  it('retorna 400 se query for inválida', async () => {
    const req = {
      query: { disponiveis: 'abc' }, // ❗ string inválida
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    const handler = getAllUsers(prismaMock as any);
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
  });

  it('retorna apenas usuários disponíveis', async () => {
    prismaMock.user.findMany.mockResolvedValue([
      { id: 1, name: 'Ana', email: 'ana@email.com', isAvailable: true },
    ]);

    const req = {
      query: { disponiveis: 'true' }, // 🚀 igual ao Express real
    } as any;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as any;

    const handler = getAllUsers(prismaMock as any);
    await handler(req, res);

    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      where: { isAvailable: true },
      select: { id: true, name: true, email: true, isAvailable: true },
    });

    expect(res.json).toHaveBeenCalledWith([
      { id: 1, name: 'Ana', email: 'ana@email.com', isAvailable: true },
    ]);
  });
});
