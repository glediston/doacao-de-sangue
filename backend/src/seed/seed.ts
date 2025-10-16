
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findUnique({
    where: { email: 'admin@gmail.com' },
  });

  if (!existing) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        name: 'Administrador',
        email: 'admin@gmail.com',
        password: hashedPassword,
        isAdmin: true,
      },
    });
    console.log('Admin criado com sucesso!');
  } else {
    console.log('Admin já existe.');
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
