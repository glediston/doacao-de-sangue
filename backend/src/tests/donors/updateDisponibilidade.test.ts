import { updateDisponibilidade } from '../../controllers/donationController';
import { prismaMock } from '../mocks/prisma.mock';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Donor Controller - updateDisponibilidade', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 🧪 1. Atualização com sucesso
  it('atualiza a disponibilidade do usuário com sucesso', async () => {
    const updatedUser = { id: 1, name: 'João', email: 'joao@email.com', isAvailable: true };

    prismaMock.user.update.mockResolvedValue(updatedUser);

    const req = mockRequest({ isAvailable: true }, { id: '1' });
    const res = mockResponse();

    const handler = updateDisponibilidade(prismaMock as any);
    await handler(req, res);

    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { isAvailable: true },
    });

    expect(res.json).toHaveBeenCalledWith({
      message: 'Disponibilidade atualizada com sucesso',
      user: updatedUser,
    });
  });

  // 🧪 2. Erro ao atualizar (ex: usuário não existe ou ID inválido)
  it('retorna 400 se ocorrer erro ao atualizar disponibilidade', async () => {
    prismaMock.user.update.mockRejectedValue(new Error('Erro DB'));

    const req = mockRequest({ isAvailable: false }, { id: '999' });
    const res = mockResponse();

    const handler = updateDisponibilidade(prismaMock as any);
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Erro ao atualizar disponibilidade',
    });
  });

});
