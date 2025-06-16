import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/assistant/suggestions - Get suggestions for the current user based on context
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Get user preferences to check if assistant is enabled and check dismissed suggestions
    const preferences = await prisma.assistantPreference.findUnique({
      where: { userId }
    });
    
    // If assistant is disabled, return empty suggestions
    if (preferences && !preferences.isEnabled) {
      return NextResponse.json({ suggestions: [] });
    }
    
    // Parse query parameters
    const url = new URL(req.url);
    const mode = url.searchParams.get('mode');
    const context = url.searchParams.get('context');
    const limit = parseInt(url.searchParams.get('limit') || '5', 10);
    
    // Build query filters
    const filters: any = {
      userId,
      isActive: true,
    };
    
    if (mode) {
      filters.mode = mode;
    }
    
    if (context) {
      filters.context = context;
    }
    
    // Get suggestions, excluding dismissed ones
    const dismissedIds = preferences?.dismissedSuggestionIds || [];
    
    const suggestions = await prisma.assistantSuggestion.findMany({
      where: {
        ...filters,
        id: { notIn: dismissedIds }
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit
    });
    
    // Log this interaction
    await prisma.assistantMemoryLog.create({
      data: {
        userId,
        action: 'FETCH_SUGGESTIONS',
        context: context || '',
        mode: mode || 'GENERAL',
        metadata: {
          url: req.url,
          suggestionsCount: suggestions.length
        }
      }
    });
    
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Error fetching assistant suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assistant suggestions' },
      { status: 500 }
    );
  }
}

// POST /api/assistant/suggestions - Create a new suggestion
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const data = await req.json();
    
    // Validate required fields
    const { title, content, mode, context, priority, actionUrl } = data;
    
    if (!title || !content || !mode) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, and mode are required' },
        { status: 400 }
      );
    }
    
    // Create suggestion
    const suggestion = await prisma.assistantSuggestion.create({
      data: {
        userId,
        title,
        content,
        mode,
        context: context || '',
        priority: priority || 1,
        actionUrl: actionUrl || null,
        isActive: true,
      }
    });
    
    // Log this interaction
    await prisma.assistantMemoryLog.create({
      data: {
        userId,
        action: 'CREATE_SUGGESTION',
        context: context || '',
        mode,
        metadata: {
          suggestionId: suggestion.id,
          title
        }
      }
    });
    
    return NextResponse.json(suggestion, { status: 201 });
  } catch (error) {
    console.error('Error creating assistant suggestion:', error);
    return NextResponse.json(
      { error: 'Failed to create assistant suggestion' },
      { status: 500 }
    );
  }
}

// PUT /api/assistant/suggestions/:id - Update a suggestion (e.g., mark as completed)
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const suggestionId = pathParts[pathParts.length - 1];
    
    if (!suggestionId) {
      return NextResponse.json(
        { error: 'Suggestion ID is required' },
        { status: 400 }
      );
    }
    
    const data = await req.json();
    
    // Check if suggestion exists and belongs to user
    const existingSuggestion = await prisma.assistantSuggestion.findFirst({
      where: {
        id: suggestionId,
        userId
      }
    });
    
    if (!existingSuggestion) {
      return NextResponse.json(
        { error: 'Suggestion not found or access denied' },
        { status: 404 }
      );
    }
    
    // Update suggestion
    const suggestion = await prisma.assistantSuggestion.update({
      where: { id: suggestionId },
      data: {
        ...data,
        // Ensure userId cannot be changed
        userId: undefined
      }
    });
    
    // Log this interaction
    await prisma.assistantMemoryLog.create({
      data: {
        userId,
        action: 'UPDATE_SUGGESTION',
        context: existingSuggestion.context || '',
        mode: existingSuggestion.mode,
        metadata: {
          suggestionId,
          changes: data
        }
      }
    });
    
    return NextResponse.json(suggestion);
  } catch (error) {
    console.error('Error updating assistant suggestion:', error);
    return NextResponse.json(
      { error: 'Failed to update assistant suggestion' },
      { status: 500 }
    );
  }
}
