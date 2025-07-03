import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { withStandardRateLimit } from '../middleware';

// GET /api/assistant/preferences - Get the current user's assistant preferences
export const GET = withStandardRateLimit(async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const supabase = getSupabaseServiceClient();
    
    // Get preferences
    const { data: preferences, error } = await supabase
      .from('assistantPreferences')
      .select('*')
      .eq('userId', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching preferences:', error);
      return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 });
    }
    
    // If no preferences exist yet, create default ones
    if (!preferences) {
      const defaultPreferences = {
        userId,
        isEnabled: true,
        proactivityLevel: 2, // Default: balanced
        preferredModes: ['MATCHING', 'PROJECT_SETUP'], // Default enabled modes
        disabledModes: [],
        disabledUntil: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const { data: newPreferences, error: createError } = await supabase
        .from('assistantPreferences')
        .insert(defaultPreferences)
        .select()
        .single();
      
      if (createError) {
        console.error('Error creating preferences:', createError);
        return NextResponse.json({ error: 'Failed to create preferences' }, { status: 500 });
      }
      
      return NextResponse.json({ data: newPreferences });
    }
    
    return NextResponse.json({ data: preferences });
  } catch (error) {
    console.error('Error in GET /api/assistant/preferences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

// PUT /api/assistant/preferences - Update the current user's assistant preferences
export const PUT = withStandardRateLimit(async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const supabase = getSupabaseServiceClient();
    
    // Parse request body
    const body = await req.json();
    
    // Validate input
    const validFields = [
      'isEnabled',
      'proactivityLevel',
      'preferredModes',
      'disabledModes',
      'disabledUntil'
    ];
    
    const updateData: Record<string, any> = {};
    
    // Only allow updating specific fields
    for (const field of validFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }
    
    // Add updatedAt timestamp
    updateData.updatedAt = new Date().toISOString();
    
    // Check if preferences exist
    const { data: existingPrefs, error: checkError } = await supabase
      .from('assistantPreferences')
      .select('id')
      .eq('userId', userId)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking preferences:', checkError);
      return NextResponse.json({ error: 'Failed to check preferences' }, { status: 500 });
    }
    
    let result;
    
    if (!existingPrefs) {
      // Create new preferences with defaults + updates
      const newPreferences = {
        userId,
        isEnabled: updateData.isEnabled !== undefined ? updateData.isEnabled : true,
        proactivityLevel: updateData.proactivityLevel !== undefined ? updateData.proactivityLevel : 2,
        preferredModes: updateData.preferredModes !== undefined ? updateData.preferredModes : ['MATCHING', 'PROJECT_SETUP'],
        disabledModes: updateData.disabledModes !== undefined ? updateData.disabledModes : [],
        disabledUntil: updateData.disabledUntil !== undefined ? updateData.disabledUntil : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('assistantPreferences')
        .insert(newPreferences)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating preferences:', error);
        return NextResponse.json({ error: 'Failed to create preferences' }, { status: 500 });
      }
      
      result = data;
    } else {
      // Update existing preferences
      const { data, error } = await supabase
        .from('assistantPreferences')
        .update(updateData)
        .eq('userId', userId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating preferences:', error);
        return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
      }
      
      result = data;
    }
    
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error('Error in PUT /api/assistant/preferences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
