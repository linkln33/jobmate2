import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth';
import { UserRole } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, firstName, lastName, role, phone } = body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Validate role
    let userRole: UserRole;
    if (role === 'CUSTOMER') {
      userRole = UserRole.CUSTOMER;
    } else if (role === 'SPECIALIST') {
      userRole = UserRole.SPECIALIST;
    } else {
      userRole = UserRole.CUSTOMER; // Default role
    }

    const user = await registerUser(
      email,
      password,
      firstName,
      lastName,
      userRole,
      phone
    );

    // Remove sensitive data before sending response
    const { passwordHash, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error.message === 'User with this email already exists') {
      return NextResponse.json(
        { message: error.message },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: 'Failed to register user' },
      { status: 500 }
    );
  }
}
