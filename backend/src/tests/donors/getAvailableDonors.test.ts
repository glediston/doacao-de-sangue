import { getAvailableDonors } from '../../controllers/donationController';
import { prismaMock } from '../mocks/prisma.mock';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Donor Controller - getAvailableDonors', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 🧪 1. Sucesso ao retornar doadores disponíveis
  it('retorna a lista de doadores disponíveis', async () => {
    const donorsData = [
      { id: 1, name: 'João', email: 'joao@email.com', isAvailable: true },
      { id: 2, name: 'Maria', email: 'maria@email.com', isAvailable: true }
    ];

    prismaMock.user.findMany.mockResolvedValue(donorsData);

    const req = mockRequest({});
    const res = mockResponse();

    const handler = getAvailableDonors(prismaMock as any);
    await handler(req, res);

    expect(res.json).toHaveBeenCalledWith(donorsData);
    expect(res.status).not.toHaveBeenCalled(); // não deve retornar erro
  });

  // 🧪 2. Erro no banco
  it('retorna 500 se ocorrer erro ao buscar doadores', async () => {
    prismaMock.user.findMany.mockRejectedValue(new Error('Erro no DB'));

    const req = mockRequest({});
    const res = mockResponse();

    const handler = getAvailableDonors(prismaMock as any);
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Erro ao buscar doadores disponíveis'
    });
  });

});
