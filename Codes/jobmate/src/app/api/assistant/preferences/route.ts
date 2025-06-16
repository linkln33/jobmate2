import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/assistant/preferences - Get the current user's assistant preferences
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Get or create preferences
    let preferences = await prisma.assistantPreference.findUnique({
      where: { userId }
    });
    
    // If no preferences exist yet, create default ones
    if (!preferences) {
      preferences = await prisma.assistantPreference.create({
        data: {
          userId,
          isEnabled: true,
          proactivityLevel: 2, // Default: balanced
          preferredModes: ['MATCHING', 'PROJECT_SETUP'], // Default enabled modes
          dismissedSuggestionIds: [],
        }
      });
    }
    
    return NextResponse.json(preferences);
  } catch (error) {
    console.error('Error fetching assistant preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assistant preferences' },
      { status: 500 }
    );
  }
}

// PUT /api/assistant/preferences - Update the current user's assistant preferences
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const data = await req.json();
    
    // Validate input data
    const { isEnabled, proactivityLevel, preferredModes, dismissedSuggestionIds } = data;
    
    // Update or create preferences
    const preferences = await prisma.assistantPreference.upsert({
      where: { userId },
      update: {
        ...(isEnabled !== undefined && { isEnabled }),
        ...(proactivityLevel !== undefined && { proactivityLevel }),
        ...(preferredModes !== undefined && { preferredModes }),
        ...(dismissedSuggestionIds !== undefined && { dismissedSuggestionIds }),
      },
      create: {
        userId,
        isEnabled: isEnabled ?? true,
        proactivityLevel: proactivityLevel ?? 2,
        preferredModes: preferredModes ?? ['MATCHING', 'PROJECT_SETUP'],
        dismissedSuggestionIds: dismissedSuggestionIds ?? [],
      }
    });
    
    return NextResponse.json(preferences);
  } catch (error) {
    console.error('Error updating assistant preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update assistant preferences' },
      { status: 500 }
    );
  }
}

// POST /api/assistant/preferences/dismiss - Dismiss a suggestion
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const { suggestionId } = await req.json();
    
    if (!suggestionId) {
      return NextResponse.json(
        { error: 'Suggestion ID is required' },
        { status: 400 }
      );
    }
    
    // Get current preferences
    let preferences = await prisma.assistantPreference.findUnique({
      where: { userId }
    });
    
    // If no preferences exist, create them
    if (!preferences) {
      preferences = await prisma.assistantPreference.create({
        data: {
          userId,
          isEnabled: true,
          proactivityLevel: 2,
          preferredModes: ['MATCHING', 'PROJECT_SETUP'],
          dismissedSuggestionIds: [suggestionId],
        }
      });
    } else {
      // Update dismissed suggestions
      const dismissedIds = preferences.dismissedSuggestionIds || [];
      if (!dismissedIds.includes(suggestionId)) {
        preferences = await prisma.assistantPreference.update({
          where: { userId },
          data: {
            dismissedSuggestionIds: [...dismissedIds, suggestionId],
          }
        });
      }
    }
    
    return NextResponse.json(preferences);
  } catch (error) {
    console.error('Error dismissing suggestion:', error);
    return NextResponse.json(
      { error: 'Failed to dismiss suggestion' },
      { status: 500 }
    );
  }
}
