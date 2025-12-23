import { updateProfile } from '../../controllers/userController';
import { prismaMock } from '../mocks/prisma.mock';
import bcrypt from 'bcrypt';

describe('User Controller - updateProfile', () => {
  it('retorna 400 se ID for inválido', async () => {
    const req = {
      params: { id: 'abc' }, // ❌ inválido
      body: {},
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    const handler = updateProfile(prismaMock as any);
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'ID inválido' });
  });

  it('retorna 400 se body for inválido', async () => {
    const req = {
      params: { id: '1' },
      body: { email: 'email-invalido' }, // ❌ email inválido
      userId: 1,
      isAdmin: true,
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    const handler = updateProfile(prismaMock as any);
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
  });

  it('retorna 403 se usuário não tiver permissão', async () => {
    const req = {
      params: { id: '2' },
      body: { name: 'Novo Nome' },
      userId: 1,
      isAdmin: false,
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    const handler = updateProfile(prismaMock as any);
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Acesso negado' });
  });

  it('atualiza usuário com sucesso', async () => {
    prismaMock.user.update.mockResolvedValue({
      id: 1,
      name: 'Ana Atualizada',
      email: 'ana@email.com',
    });

    const req = {
      params: { id: '1' },
      body: { name: 'Ana Atualizada' },
      userId: 1,
      isAdmin: false,
    } as any;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as any;

    const handler = updateProfile(prismaMock as any);
    await handler(req, res);

    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { name: 'Ana Atualizada' },
    });

    expect(res.json).toHaveBeenCalledWith({
      message: 'Usuário atualizado com sucesso',
      user: {
        id: 1,
        name: 'Ana Atualizada',
        email: 'ana@email.com',
      },
    });
  });

  it('faz hash da senha ao atualizar', async () => {
    const hashed = await bcrypt.hash('novaSenha', 10);
    prismaMock.user.update.mockResolvedValue({
      id: 1,
      name: 'Ana',
      email: 'ana@email.com',
      password: hashed,
    });

    const req = {
      params: { id: '1' },
      body: { password: 'novaSenha' },
      userId: 1,
      isAdmin: false,
    } as any;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as any;

    const handler = updateProfile(prismaMock as any);
    await handler(req, res);

    const call = prismaMock.user.update.mock.calls[0][0];
    expect(call.data.password).not.toBe('novaSenha'); // deve ser hash
    expect(res.json).toHaveBeenCalledWith({
      message: 'Usuário atualizado com sucesso',
      user: expect.objectContaining({ id: 1 }),
    });
  });
});
