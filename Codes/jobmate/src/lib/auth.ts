import { PrismaClient, User, UserRole } from '@prisma/client';
import { compare, hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// JWT token generation
export const generateToken = (user: User): string => {
  const secret = process.env.JWT_SECRET || 'default-secret-key-change-in-production';
  
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    secret,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

// Password hashing
export const hashPassword = async (password: string): Promise<string> => {
  return hash(password, 12);
};

// Password verification
export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return compare(password, hashedPassword);
};

// User registration
export const registerUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role: UserRole = UserRole.CUSTOMER,
  phone?: string
): Promise<User> => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash the password
  const hashedPassword = await hashPassword(password);

  // Create the user
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: hashedPassword,
      firstName,
      lastName,
      role,
      phone,
      emailVerified: false,
      phoneVerified: false,
      isVerified: false,
      isActive: true,
    },
  });

  // Create profile based on role
  if (role === UserRole.CUSTOMER) {
    await prisma.customerProfile.create({
      data: {
        userId: user.id,
      },
    });
  } else if (role === UserRole.SPECIALIST) {
    await prisma.specialistProfile.create({
      data: {
        userId: user.id,
        availabilityStatus: 'offline',
      },
    });
  }

  // Create wallet for the user
  await prisma.wallet.create({
    data: {
      userId: user.id,
      balance: 0,
      currency: 'USD',
      isActive: true,
    },
  });

  return user;
};

// User login
export const loginUser = async (
  email: string,
  password: string
): Promise<{ user: User; token: string }> => {
  // Find the user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Verify password
  const isPasswordValid = await verifyPassword(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Check if user is active
  if (!user.isActive) {
    throw new Error('Account is disabled. Please contact support.');
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  // Generate JWT token
  const token = generateToken(user);

  return { user, token };
};

// Get user by ID
export const getUserById = async (id: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id },
  });
};

// Verify JWT token
export const verifyToken = (token: string): any => {
  try {
    const secret = process.env.JWT_SECRET || 'default-secret-key-change-in-production';
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

// Get user from request
export const getUserFromRequest = async (
  req: Request
): Promise<User | null> => {
  try {
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    return getUserById(decoded.id);
  } catch (error) {
    return null;
  }
};

// Role-based authorization middleware
export const authorize = (allowedRoles: UserRole[]) => {
  return async (req: Request): Promise<{ user: User } | Response> => {
    try {
      const user = await getUserFromRequest(req);

      if (!user) {
        return new Response(JSON.stringify({ message: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (!allowedRoles.includes(user.role)) {
        return new Response(JSON.stringify({ message: 'Forbidden' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return { user };
    } catch (error) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  };
};
