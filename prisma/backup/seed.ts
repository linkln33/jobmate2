import { PrismaClient, UserRole } from '@prisma/client';
import { hash } from 'bcryptjs';

// Define JobStatus enum to match schema.prisma
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
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@jobmate.com' },
    update: {},
    create: {
      email: 'admin@jobmate.com',
      passwordHash: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      isVerified: true,
      emailVerified: true,
      isActive: true,
    },
  });
  console.log('Admin user created:', admin.email);

  // Create service categories
  const categories = [
    {
      name: 'Plumbing',
      description: 'Plumbing services including repairs, installations, and maintenance',
      iconUrl: '/icons/plumbing.svg',
    },
    {
      name: 'Electrical',
      description: 'Electrical services including wiring, installations, and repairs',
      iconUrl: '/icons/electrical.svg',
    },
    {
      name: 'Carpentry',
      description: 'Carpentry services including furniture assembly, repairs, and custom builds',
      iconUrl: '/icons/carpentry.svg',
    },
    {
      name: 'Painting',
      description: 'Interior and exterior painting services',
      iconUrl: '/icons/painting.svg',
    },
    {
      name: 'Cleaning',
      description: 'Cleaning services for homes and offices',
      iconUrl: '/icons/cleaning.svg',
    },
    {
      name: 'Gardening',
      description: 'Gardening and landscaping services',
      iconUrl: '/icons/gardening.svg',
    },
    {
      name: 'Moving',
      description: 'Moving and delivery services',
      iconUrl: '/icons/moving.svg',
    },
    {
      name: 'Appliance Repair',
      description: 'Repair services for home appliances',
      iconUrl: '/icons/appliance.svg',
    },
    {
      name: 'HVAC',
      description: 'Heating, ventilation, and air conditioning services',
      iconUrl: '/icons/hvac.svg',
    },
    {
      name: 'Roofing',
      description: 'Roofing installation and repair services',
      iconUrl: '/icons/roofing.svg',
    },
  ];

  for (const category of categories) {
    // Check if category exists by name first
    const existingCategory = await prisma.serviceCategory.findFirst({
      where: {
        name: {
          equals: category.name,
          mode: 'insensitive'
        }
      }
    });

    if (existingCategory) {
      console.log(`Category already exists: ${category.name}`);
      continue;
    }

    // Create new category
    const createdCategory = await prisma.serviceCategory.create({
      data: category,
    });
    console.log(`Category created: ${createdCategory.name}`);
  }

  // Create demo customer user
  const customerPassword = await hash('customer123', 12);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      passwordHash: customerPassword,
      firstName: 'Demo',
      lastName: 'Customer',
      role: UserRole.CUSTOMER,
      isVerified: true,
      emailVerified: true,
      isActive: true,
    },
  });
  console.log('Demo customer created:', customer.email);

  // Create customer profile
  await prisma.customerProfile.upsert({
    where: { userId: customer.id },
    update: {},
    create: {
      userId: customer.id,
    },
  });

  // Create demo specialist user
  const specialistPassword = await hash('specialist123', 12);
  const specialist = await prisma.user.upsert({
    where: { email: 'specialist@example.com' },
    update: {},
    create: {
      email: 'specialist@example.com',
      passwordHash: specialistPassword,
      firstName: 'Demo',
      lastName: 'Specialist',
      role: UserRole.SPECIALIST,
      isVerified: true,
      emailVerified: true,
      isActive: true,
    },
  });
  console.log('Demo specialist created:', specialist.email);

  // Create specialist profile
  await prisma.specialistProfile.upsert({
    where: { userId: specialist.id },
    update: {},
    create: {
      userId: specialist.id,
      availabilityStatus: 'available',
    },
  });

  // Create wallets for users
  await prisma.wallet.upsert({
    where: { userId: customer.id },
    update: {},
    create: {
      userId: customer.id,
      balance: 500.00,
      currency: 'USD',
      isActive: true,
    },
  });

  await prisma.wallet.upsert({
    where: { userId: specialist.id },
    update: {},
    create: {
      userId: specialist.id,
      balance: 1000.00,
      currency: 'USD',
      isActive: true,
    },
  });

  // Create sample jobs
  const plumbingCategory = await prisma.serviceCategory.findFirst({
    where: { name: 'Plumbing' },
  });

  const electricalCategory = await prisma.serviceCategory.findFirst({
    where: { name: 'Electrical' },
  });

  if (plumbingCategory && electricalCategory) {
    try {
      // Create jobs first
      const job1 = await prisma.job.create({
        data: {
          id: 'sample-job-1',
          title: 'Fix leaking kitchen sink',
          description: 'The kitchen sink has been leaking for a few days. Need someone to fix it as soon as possible.',
          status: JobStatus.OPEN,
          address: '123 Main St, San Francisco, CA 94105',
          city: 'San Francisco',
          zipCode: '94105',
          country: 'USA',
          latitude: 37.7749,
          longitude: -122.4194,
          customerId: customer.id,
          serviceCategoryId: plumbingCategory.id,
          budgetMin: 80.00,
          budgetMax: 120.00,
          urgencyLevel: 'high'
        },
      });
      console.log('Sample job created:', job1.title);

      // Create second job
      const job2 = await prisma.job.create({
        data: {
          id: 'sample-job-2',
          title: 'Install new ceiling light',
          description: 'Need to install a new ceiling light fixture in the living room. I have the fixture already.',
          status: JobStatus.OPEN,
          address: '456 Market St, San Francisco, CA 94105',
          city: 'San Francisco',
          zipCode: '94105',
          country: 'USA',
          latitude: 37.7899,
          longitude: -122.4014,
          customerId: customer.id,
          serviceCategoryId: electricalCategory.id,
          budgetMin: 60.00,
          budgetMax: 90.00,
          urgencyLevel: 'medium'
        },
      });
      console.log('Sample job created:', job2.title);
    } catch (error) {
      console.error('Error creating sample jobs:', error);
    }
  }

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
