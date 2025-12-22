import { email } from 'zod';
import { register } from '../controllers/authController';
import bcrypt from './mocks/bcrypt.mock';
import { mockRequest, mockResponse } from './mocks/express.mock';
import { prismaMock } from './mocks/prisma.mock';

describe('Register Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve cadastrar usuário com sucesso', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue({ id: 1 });
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');

    const req = mockRequest({
      name: 'Maria',
      email: 'maria@email.com',
      password: '123456',
      bloodType: 'A+',
    });

    const res = mockResponse();

    const controller = register(prismaMock as any);
    await controller(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });
});

describe('O email já existe', async () =>{
prismaMock.user.findUnique.mockResolvedValue({id: 1});

 const req = mockRequest({
      name: 'Maria',
      email: 'maria@email.com',
      password: '123456',
      bloodType: 'A+',
    });


const res = mockResponse();


expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
  where: {email: 'maria@email.com'},
})


 expect(prismaMock.user.create).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(400);

})
