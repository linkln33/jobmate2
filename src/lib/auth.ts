import { createClient } from '@supabase/supabase-js';
import { compare, hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getSupabaseClient, getSupabaseServiceClient } from './supabase/client';

// User role enum to match what was in Prisma
export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
  SPECIALIST = 'SPECIALIST'
}

// User type definition
export type User = {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone?: string;
  profileImageUrl?: string;
  isVerified: boolean;
  isActive: boolean;
};

// Extend the session and JWT types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: UserRole;
    };
  }
  
  interface User {
    id: string;
    role?: UserRole;
    name?: string;
    email?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: UserRole;
  }
}

// NextAuth options configuration
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Use Supabase to authenticate
          const supabase = getSupabaseClient();
          
          // First, try to sign in with Supabase Auth
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });
          
          if (authError || !authData.user) {
            console.error('Authentication error:', authError);
            return null;
          }
          
          // Get additional user profile data from the profiles table
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, role, is_verified, is_active, profile_image_url, phone')
            .eq('user_id', authData.user.id)
            .single();
            
          if (profileError || !profileData) {
            console.error('Profile fetch error:', profileError);
            return null;
          }
          
          // Return the user object in the format NextAuth expects
          return {
            id: authData.user.id,
            email: authData.user.email,
            name: `${profileData.first_name} ${profileData.last_name}`,
            role: profileData.role as UserRole,
            image: profileData.profile_image_url,
          };
        } catch (error) {
          console.error('Login error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  }
};

// JWT token generation
export function generateToken(user: User): string {
  const secret = process.env.JWT_SECRET || 'fallback-secret-do-not-use-in-production';
  
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12);
}

// Password verification
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await compare(password, hashedPassword);
}

// User registration
export async function registerUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role: UserRole = UserRole.CUSTOMER,
  phone?: string
): Promise<User> {
  const supabase = getSupabaseServiceClient();
  
  // First, create the auth user in Supabase
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (authError || !authData.user) {
    console.error('Auth signup error:', authError);
    throw new Error(authError?.message || 'Failed to create user');
  }
  
  // Then create the profile record
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .insert({
      user_id: authData.user.id,
      first_name: firstName,
      last_name: lastName,
      email: email,
      role: role,
      phone: phone || null,
      is_verified: false,
      is_active: true,
    })
    .select()
    .single();
  
  if (profileError || !profileData) {
    // Rollback: Delete the auth user if profile creation fails
    await supabase.auth.admin.deleteUser(authData.user.id);
    console.error('Profile creation error:', profileError);
    throw new Error(profileError?.message || 'Failed to create user profile');
  }
  
  // Create customer or specialist profile based on role
  if (role === UserRole.CUSTOMER) {
    const { error: customerError } = await supabase
      .from('customer_profiles')
      .insert({
        user_id: authData.user.id,
      });
      
    if (customerError) {
      console.error('Customer profile creation error:', customerError);
      throw new Error(customerError.message);
    }
  } else if (role === UserRole.SPECIALIST) {
    const { error: specialistError } = await supabase
      .from('specialist_profiles')
      .insert({
        user_id: authData.user.id,
      });
      
    if (specialistError) {
      console.error('Specialist profile creation error:', specialistError);
      throw new Error(specialistError.message);
    }
  }
  
  // Create wallet for the user
  const { error: walletError } = await supabase
    .from('wallets')
    .insert({
      user_id: authData.user.id,
      balance: 0,
      currency: 'USD',
    });
    
  if (walletError) {
    console.error('Wallet creation error:', walletError);
    throw new Error(walletError.message);
  }
  
  // Return the user object
  return {
    id: authData.user.id,
    email: email,
    firstName: firstName,
    lastName: lastName,
    role: role,
    phone: phone,
    isVerified: false,
    isActive: true,
  };
}

// User login
export async function loginUser(
  email: string,
  password: string
): Promise<{ user: User; token: string }> {
  const supabase = getSupabaseClient();
  
  // Sign in with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (authError || !authData.user) {
    console.error('Login error:', authError);
    throw new Error(authError?.message || 'Invalid email or password');
  }
  
  // Get user profile data
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, role, is_verified, is_active, profile_image_url, phone')
    .eq('user_id', authData.user.id)
    .single();
    
  if (profileError || !profileData) {
    console.error('Profile fetch error:', profileError);
    throw new Error('User profile not found');
  }
  
  // Update last login timestamp
  await supabase
    .from('profiles')
    .update({ last_login: new Date().toISOString() })
    .eq('user_id', authData.user.id);
  
  // Create user object
  const user: User = {
    id: authData.user.id,
    email: authData.user.email!,
    firstName: profileData.first_name,
    lastName: profileData.last_name,
    role: profileData.role as UserRole,
    phone: profileData.phone || undefined,
    profileImageUrl: profileData.profile_image_url || undefined,
    isVerified: profileData.is_verified,
    isActive: profileData.is_active,
  };
  
  // Generate JWT token
  const token = generateToken(user);
  
  return { user, token };
}

// Get user by ID
export async function getUserById(id: string): Promise<User | null> {
  const supabase = getSupabaseClient();
  
  // Get user profile data
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('id, user_id, first_name, last_name, email, role, is_verified, is_active, profile_image_url, phone')
    .eq('user_id', id)
    .single();
    
  if (profileError || !profileData) {
    console.error('Profile fetch error:', profileError);
    return null;
  }
  
  return {
    id: profileData.user_id,
    email: profileData.email,
    firstName: profileData.first_name,
    lastName: profileData.last_name,
    role: profileData.role as UserRole,
    phone: profileData.phone || undefined,
    profileImageUrl: profileData.profile_image_url || undefined,
    isVerified: profileData.is_verified,
    isActive: profileData.is_active,
  };
}

// Verify JWT token
export function verifyToken(token: string): any {
  try {
    const secret = process.env.JWT_SECRET || 'fallback-secret-do-not-use-in-production';
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}

// Get user from request
export async function getUserFromRequest(
  req: Request
): Promise<User | null> {
  // Extract token from Authorization header
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  const decoded = verifyToken(token);
  
  if (!decoded || !decoded.id) {
    return null;
  }
  
  return await getUserById(decoded.id);
}

// Role-based authorization middleware
export function authorize(allowedRoles: UserRole[]) {
  return async (req: Request) => {
    const user = await getUserFromRequest(req);
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (!allowedRoles.includes(user.role)) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return null; // Authorization successful
  };
}
