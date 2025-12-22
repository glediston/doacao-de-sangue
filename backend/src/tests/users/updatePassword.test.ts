

// src/tests/users/updatePassword.test.ts
jest.mock('bcrypt', () => require('../mocks/bcrypt.mock'));

import { updatePassword } from '../../controllers/userController';
import { prismaMock } from '../mocks/prisma.mock';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import bcrypt from 'bcrypt';

describe('User Controller - updatePassword', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 🧪 1. Atualiza senha corretamente quando usuário fornece senha atual correta
  it('permite atualizar senha com senha correta', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 1, password: 'old-hash' });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (bcrypt.hash as jest.Mock).mockResolvedValue('new-hash');
    prismaMock.user.update.mockResolvedValue({ id: 1, password: 'new-hash' });

    const req = mockRequest(
      { senhaAtual: '1234', senhaNova: '5678' },
      { id: '1' },
      {},
      { userId: 1, isAdmin: false } // userId e isAdmin simulam middleware de autenticação
    );
    const res = mockResponse();

    await updatePassword(prismaMock as any)(req, res);

    expect(bcrypt.compare).toHaveBeenCalledWith('1234', 'old-hash');
    expect(bcrypt.hash).toHaveBeenCalledWith('5678', 10);
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { password: 'new-hash' },
    });
    expect(res.json).toHaveBeenCalledWith({ message: 'Senha atualizada com sucesso' });
  });

  // 🧪 2. Bloqueia atualização se senha atual estiver incorreta
  it('bloqueia atualização se senha atual estiver incorreta', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 1, password: 'old-hash' });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const req = mockRequest(
      { senhaAtual: 'errada', senhaNova: '5678' },
      { id: '1' },
      {},
      { userId: 1, isAdmin: false }
    );
    const res = mockResponse();

    await updatePassword(prismaMock as any)(req, res);

    expect(bcrypt.compare).toHaveBeenCalledWith('errada', 'old-hash');
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Senha atual incorreta' });
  });

  // 🧪 3. Admin pode atualizar senha sem fornecer senha atual
  it('permite admin atualizar senha sem senha atual', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 1, password: 'old-hash' });
    (bcrypt.hash as jest.Mock).mockResolvedValue('new-hash');
    prismaMock.user.update.mockResolvedValue({ id: 1, password: 'new-hash' });

    const req = mockRequest(
      { senhaNova: '5678' },
      { id: '1' },
      {},
      { userId: 99, isAdmin: true }
    );
    const res = mockResponse();

    await updatePassword(prismaMock as any)(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith('5678', 10);
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { password: 'new-hash' },
    });
    expect(res.json).toHaveBeenCalledWith({ message: 'Senha atualizada com sucesso' });
  });

  // 🧪 4. Usuário não encontrado
  it('retorna 404 se usuário não existir', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const req = mockRequest(
      { senhaAtual: '1234', senhaNova: '5678' },
      { id: '1' },
      {},
      { userId: 1, isAdmin: false }
    );
    const res = mockResponse();

    await updatePassword(prismaMock as any)(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Usuário não encontrado' });
  });

  // 🧪 5. Acesso negado se usuário não for admin nem dono do perfil
  it('bloqueia atualização se usuário não for admin nem dono do perfil', async () => {
    const req = mockRequest(
      { senhaAtual: '1234', senhaNova: '5678' },
      { id: '2' },
      {},
      { userId: 1, isAdmin: false }
    );
    const res = mockResponse();

    await updatePassword(prismaMock as any)(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Acesso negado' });
  });

  // 🧪 6. Erro inesperado
  it('retorna 400 se ocorrer erro ao atualizar senha', async () => {
    prismaMock.user.findUnique.mockRejectedValue(new Error('Erro inesperado'));

    const req = mockRequest(
      { senhaAtual: '1234', senhaNova: '5678' },
      { id: '1' },
      {},
      { userId: 1, isAdmin: false }
    );
    const res = mockResponse();

    await updatePassword(prismaMock as any)(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao atualizar senha' });
  });
});
