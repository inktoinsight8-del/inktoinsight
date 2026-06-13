const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'admin@inkandinsight.in' } });
  console.log('User:', user);
  if (user) {
    const match = await bcrypt.compare('password123', user.password);
    console.log('Password match:', match);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
