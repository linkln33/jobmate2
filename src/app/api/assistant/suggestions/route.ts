import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { withAIRateLimit } from '../middleware';

// GET /api/assistant/suggestions - Get suggestions for the current user based on context
export const GET = withAIRateLimit(async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const supabase = getSupabaseServiceClient();
    
    // Get user preferences to check if assistant is enabled and check dismissed suggestions
    const { data: preferences, error: prefsError } = await supabase
      .from('assistantPreferences')
      .select('*')
      .eq('userId', userId)
      .maybeSingle();
    
    if (prefsError) {
      console.error('Error fetching preferences:', prefsError);
      return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 });
    }
    
    // If assistant is disabled, return empty suggestions
    if (preferences && !preferences.isEnabled) {
      return NextResponse.json({ suggestions: [] });
    }
    
    // Parse query parameters
    const url = new URL(req.url);
    const mode = url.searchParams.get('mode');
    const context = url.searchParams.get('context') ? JSON.parse(url.searchParams.get('context') || '{}') : {};
    
    // Check if the mode is disabled for this user
    if (preferences?.disabledModes?.includes(mode)) {
      return NextResponse.json({ suggestions: [] });
    }
    
    // Check if the assistant is temporarily disabled
    if (preferences?.disabledUntil && new Date(preferences.disabledUntil) > new Date()) {
      return NextResponse.json({ suggestions: [] });
    }
    
    // Get active suggestions for the user that haven't been dismissed
    const { data: activeSuggestions, error: suggestionsError } = await supabase
      .from('assistantSuggestions')
      .select('*')
      .eq('userId', userId)
      .eq('isDismissed', false)
      .eq('mode', mode)
      .order('createdAt', { ascending: false });
    
    if (suggestionsError) {
      console.error('Error fetching suggestions:', suggestionsError);
      return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
    }
    
    // Filter suggestions based on context if needed
    // This is a simplified example - you may need more complex filtering logic
    const filteredSuggestions = activeSuggestions.filter(suggestion => {
      // Add any context-based filtering logic here
      return true;
    });
    
    return NextResponse.json({ suggestions: filteredSuggestions || [] });
  } catch (error) {
    console.error('Error in GET /api/assistant/suggestions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

// PUT /api/assistant/suggestions - Update suggestion status (dismiss, accept)
export const PUT = withAIRateLimit(async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const supabase = getSupabaseServiceClient();
    
    // Parse request body
    const body = await req.json();
    const { suggestionId, action } = body;
    
    if (!suggestionId || !action) {
      return NextResponse.json({ error: 'Missing suggestionId or action' }, { status: 400 });
    }
    
    // Verify the suggestion belongs to the user
    const { data: suggestion, error: fetchError } = await supabase
      .from('assistantSuggestions')
      .select('*')
      .eq('id', suggestionId)
      .eq('userId', userId)
      .single();
    
    if (fetchError || !suggestion) {
      console.error('Error fetching suggestion:', fetchError);
      return NextResponse.json({ error: 'Suggestion not found' }, { status: 404 });
    }
    
    // Update the suggestion based on action
    if (action === 'dismiss') {
      const { data: updatedSuggestion, error: updateError } = await supabase
        .from('assistantSuggestions')
        .update({
          isDismissed: true,
          updatedAt: new Date().toISOString()
        })
        .eq('id', suggestionId)
        .select()
        .single();
      
      if (updateError) {
        console.error('Error dismissing suggestion:', updateError);
        return NextResponse.json({ error: 'Failed to dismiss suggestion' }, { status: 500 });
      }
      
      return NextResponse.json({ data: updatedSuggestion });
    } else if (action === 'accept') {
      const { data: updatedSuggestion, error: updateError } = await supabase
        .from('assistantSuggestions')
        .update({
          isAccepted: true,
          updatedAt: new Date().toISOString()
        })
        .eq('id', suggestionId)
        .select()
        .single();
      
      if (updateError) {
        console.error('Error accepting suggestion:', updateError);
        return NextResponse.json({ error: 'Failed to accept suggestion' }, { status: 500 });
      }
      
      return NextResponse.json({ data: updatedSuggestion });
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in PUT /api/assistant/suggestions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
