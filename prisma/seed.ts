import { PrismaClient } from '@prisma/client';

// This is a simplified seed file that won't be used during build
// The full seed file is stored in prisma/backup/seed.ts
console.log('This is a placeholder seed file for build compatibility');

const prisma = new PrismaClient();

async function main() {
  console.log('Seed file placeholder - not executing actual seeding');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
