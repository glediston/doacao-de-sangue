// src/tests/users/updateProfile.test.ts
jest.mock('bcrypt', () => require('../mocks/bcrypt.mock'));

import { updateProfile } from '../../controllers/userController';
import { prismaMock } from '../mocks/prisma.mock';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import bcrypt from 'bcrypt';

describe('User Controller - updateProfile', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 🧪 1. Atualização de perfil normal (usuário atual)
  it('permite usuário atualizar seu próprio perfil', async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('hash-senha');
    prismaMock.user.update.mockResolvedValue({ id: 1, name: 'Novo Nome', email: 'novo@email.com', password: 'hash-senha' });

    const req = mockRequest(
      { name: 'Novo Nome', email: 'novo@email.com', password: '1234' },
      { id: '1' },
      {},
      { userId: 1, isAdmin: false }
    );
    const res = mockResponse();

    await updateProfile(prismaMock as any)(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith('1234', 10);
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { name: 'Novo Nome', email: 'novo@email.com', password: 'hash-senha' },
    });
    expect(res.json).toHaveBeenCalledWith({
      message: 'Usuário atualizado com sucesso',
      user: { id: 1, name: 'Novo Nome', email: 'novo@email.com', password: 'hash-senha' },
    });
  });

  // 🧪 2. Admin atualizando perfil de outro usuário
  it('permite admin atualizar perfil de outro usuário', async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('hash-senha');
    prismaMock.user.update.mockResolvedValue({ id: 2, name: 'Nome Admin', email: 'admin@email.com', password: 'hash-senha' });

    const req = mockRequest(
      { name: 'Nome Admin', email: 'admin@email.com', password: '1234' },
      { id: '2' },
      {},
      { userId: 1, isAdmin: true }
    );
    const res = mockResponse();

    await updateProfile(prismaMock as any)(req, res);

    expect(res.json).toHaveBeenCalledWith({
      message: 'Usuário atualizado com sucesso',
      user: { id: 2, name: 'Nome Admin', email: 'admin@email.com', password: 'hash-senha' },
    });
  });

  // 🧪 3. Acesso negado se usuário não for admin nem dono do perfil
  it('bloqueia atualização se usuário não for admin nem dono do perfil', async () => {
    const req = mockRequest(
      { name: 'Tentativa' },
      { id: '2' },
      {},
      { userId: 1, isAdmin: false }
    );
    const res = mockResponse();

    await updateProfile(prismaMock as any)(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Acesso negado' });
  });

  // 🧪 4. Erro inesperado do banco
  it('retorna 400 se ocorrer erro ao atualizar perfil', async () => {
    prismaMock.user.update.mockRejectedValue(new Error('Erro inesperado'));

    const req = mockRequest(
      { name: 'Nome Erro' },
      { id: '1' },
      {},
      { userId: 1, isAdmin: false }
    );
    const res = mockResponse();

    await updateProfile(prismaMock as any)(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao atualizar perfil' });
  });
});
