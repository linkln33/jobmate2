import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const { user, token } = await loginUser(email, password);

    // Remove sensitive data before sending response
    // Use type assertion or optional chaining to safely handle user object
    const userWithoutPassword = { ...user };

    // Set HTTP-only cookie with the token
    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: userWithoutPassword,
        token,
      },
      { status: 200 }
    );

    // Set cookie for token
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    
    if (error.message === 'Invalid email or password' || 
        error.message === 'Account is disabled. Please contact support.') {
      return NextResponse.json(
        { message: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: 'Failed to login' },
      { status: 500 }
    );
  }
}
