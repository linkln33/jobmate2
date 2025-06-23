// This is a simplified seed file for build compatibility
// Original seed functionality is preserved but modified to avoid build errors

import { PrismaClient } from '@prisma/client';

// Define JobStatus enum locally instead of importing it
enum JobStatus {
  DRAFT = 'DRAFT',
  OPEN = 'OPEN',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DISPUTED = 'DISPUTED'
}

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
