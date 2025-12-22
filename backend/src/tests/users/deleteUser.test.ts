// src/tests/users/deleteUser.test.ts
import { deleteUser } from '../../controllers/userController';
import { prismaMock } from '../mocks/prisma.mock';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('User Controller - deleteUser', () => {
  beforeEach(() => jest.clearAllMocks());

  it('permite admin deletar usuário', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 2 });
    prismaMock.user.delete.mockResolvedValue({});

    const req = mockRequest({}, { id: '2' }, {}, { userId: 1, isAdmin: true });
    const res = mockResponse();

    await deleteUser(prismaMock as any)(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuário deletado com sucesso' });
  });

  it('bloqueia usuário comum de deletar outro usuário', async () => {
    const req = mockRequest({}, { id: '2' }, {}, { userId: 1, isAdmin: false });
    const res = mockResponse();

    await deleteUser(prismaMock as any)(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Acesso negado' });
  });
});
