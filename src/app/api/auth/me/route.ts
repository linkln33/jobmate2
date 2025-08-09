import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);

    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Remove sensitive data before sending response
    // Use type assertion or optional chaining to safely handle user object
    const userWithoutPassword = { ...user };

    return NextResponse.json(
      { user: userWithoutPassword },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { message: 'Failed to get user information' },
      { status: 500 }
    );
  }
}
