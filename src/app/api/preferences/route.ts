import { NextRequest, NextResponse } from 'next/server';

// Mock database for development
const preferenceDb = new Map<string, any>();

/**
 * GET /api/preferences
 * Get user preferences for a specific intent and category
 */
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const intentId = searchParams.get('intentId');
    const categoryId = searchParams.get('categoryId');
    
    // Validate required parameters
    if (!userId || !intentId || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required parameters: userId, intentId, categoryId' },
        { status: 400 }
      );
    }
    
    // Generate a unique key for this preference
    const preferenceKey = `${userId}:${intentId}:${categoryId}`;
    
    // Check if preferences exist
    if (preferenceDb.has(preferenceKey)) {
      return NextResponse.json({
        success: true,
        preferences: preferenceDb.get(preferenceKey)
      });
    }
    
    // Return empty preferences if not found
    return NextResponse.json({
      success: true,
      preferences: null
    });
  } catch (error) {
    console.error('Error getting preferences:', error);
    return NextResponse.json(
      { error: 'Failed to get preferences' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/preferences
 * Save user preferences
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { userId, intentId, categoryId, preferences } = body;
    
    // Validate required parameters
    if (!userId || !intentId || !categoryId || !preferences) {
      return NextResponse.json(
        { error: 'Missing required parameters: userId, intentId, categoryId, preferences' },
        { status: 400 }
      );
    }
    
    // Generate a unique key for this preference
    const preferenceKey = `${userId}:${intentId}:${categoryId}`;
    
    // Generate a unique ID for this preference
    const preferencesId = `pref-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Store preferences with metadata
    const preferenceData = {
      ...preferences,
      userId,
      intentId,
      categoryId,
      preferencesId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Save to mock database
    preferenceDb.set(preferenceKey, preferenceData);
    
    // Return success response
    return NextResponse.json({
      success: true,
      preferencesId
    });
  } catch (error) {
    console.error('Error saving preferences:', error);
    return NextResponse.json(
      { error: 'Failed to save preferences' },
      { status: 500 }
    );
  }
}
