// Minimal seed file for deployment
// Original seed file is preserved in prisma_backup directory

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Empty seed function for deployment
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
