

import { register } from '../../controllers/authController';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { prismaMock } from '../mocks/prisma.mock';

describe('Auth Controller - register', () => {

  it('deve retornar 400 se o body for inválido', async () => {
    const req = mockRequest({}); // body vazio
    const res = mockResponse();

    const handler = register(prismaMock as any);
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
  });

});
