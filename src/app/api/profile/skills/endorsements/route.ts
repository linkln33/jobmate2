import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { getSupabaseServiceClient } from '@/lib/supabase/client';

/**
 * GET /api/profile/skills/endorsements
 * Get endorsements for a specific user skill
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userSkillId = searchParams.get('userSkillId');
    
    if (!userSkillId) {
      return NextResponse.json(
        { message: 'User skill ID is required' },
        { status: 400 }
      );
    }
    
    const supabase = getSupabaseServiceClient();
    
    // Get the user skill with endorsements
    const { data: userSkill, error: skillError } = await supabase
      .from('userSkills')
      .select('id, userId, skillId')
      .eq('id', userSkillId)
      .single();
    
    if (skillError || !userSkill) {
      console.error('Error fetching user skill:', skillError);
      return NextResponse.json(
        { message: 'User skill not found' },
        { status: 404 }
      );
    }
    
    // Get endorsements for this skill
    const { data: endorsements, error: endorsementsError } = await supabase
      .from('skillEndorsements')
      .select(`
        id,
        userSkillId,
        endorserId,
        createdAt,
        endorser:endorserId (
          id,
          firstName,
          lastName,
          profileImage,
          title
        )
      `)
      .eq('userSkillId', userSkillId);
    
    if (endorsementsError) {
      console.error('Error fetching endorsements:', endorsementsError);
      return NextResponse.json(
        { message: 'Failed to fetch endorsements' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ endorsements: endorsements || [] });
  } catch (error) {
    console.error('Error in GET /api/profile/skills/endorsements:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/profile/skills/endorsements
 * Create a new skill endorsement
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);

    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { userSkillId } = body;
    
    if (!userSkillId) {
      return NextResponse.json(
        { message: 'User skill ID is required' },
        { status: 400 }
      );
    }
    
    const supabase = getSupabaseServiceClient();
    
    // Get the user skill
    const { data: userSkill, error: skillError } = await supabase
      .from('userSkills')
      .select('id, userId, skillId')
      .eq('id', userSkillId)
      .single();
    
    if (skillError || !userSkill) {
      console.error('Error fetching user skill:', skillError);
      return NextResponse.json(
        { message: 'User skill not found' },
        { status: 404 }
      );
    }
    
    // Prevent self-endorsement
    if (userSkill.userId === user.id) {
      return NextResponse.json(
        { message: 'You cannot endorse your own skills' },
        { status: 400 }
      );
    }
    
    // Check if user has already endorsed this skill
    const { data: existingEndorsement, error: checkError } = await supabase
      .from('skillEndorsements')
      .select('id')
      .eq('userSkillId', userSkillId)
      .eq('endorserId', user.id)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking existing endorsement:', checkError);
      return NextResponse.json(
        { message: 'Failed to check existing endorsement' },
        { status: 500 }
      );
    }
    
    if (existingEndorsement) {
      return NextResponse.json(
        { message: 'You have already endorsed this skill' },
        { status: 400 }
      );
    }
    
    // Create the endorsement
    const { data: endorsement, error: createError } = await supabase
      .from('skillEndorsements')
      .insert({
        userSkillId,
        endorserId: user.id
      })
      .select(`
        id,
        userSkillId,
        endorserId,
        createdAt,
        endorser:endorserId (
          id,
          firstName,
          lastName,
          profileImage,
          title
        )
      `)
      .single();
    
    if (createError || !endorsement) {
      console.error('Error creating endorsement:', createError);
      return NextResponse.json(
        { message: 'Failed to create endorsement' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ endorsement });
  } catch (error) {
    console.error('Error in POST /api/profile/skills/endorsements:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/profile/skills/endorsements?id={endorsementId}
 * Remove a skill endorsement
 */
export async function DELETE(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);

    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const endorsementId = searchParams.get('id');
    
    if (!endorsementId) {
      return NextResponse.json(
        { message: 'Endorsement ID is required' },
        { status: 400 }
      );
    }
    
    const supabase = getSupabaseServiceClient();
    
    // Get the endorsement
    const { data: endorsement, error: fetchError } = await supabase
      .from('skillEndorsements')
      .select('id, endorserId, userSkillId')
      .eq('id', endorsementId)
      .single();
    
    if (fetchError || !endorsement) {
      console.error('Error fetching endorsement:', fetchError);
      return NextResponse.json(
        { message: 'Endorsement not found' },
        { status: 404 }
      );
    }
    
    // Verify the user is the endorser
    if (endorsement.endorserId !== user.id) {
      return NextResponse.json(
        { message: 'You can only remove your own endorsements' },
        { status: 403 }
      );
    }
    
    // Delete the endorsement
    const { error: deleteError } = await supabase
      .from('skillEndorsements')
      .delete()
      .eq('id', endorsementId);
    
    if (deleteError) {
      console.error('Error deleting endorsement:', deleteError);
      return NextResponse.json(
        { message: 'Failed to delete endorsement' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Endorsement removed successfully',
      deletedId: endorsementId
    });
  } catch (error) {
    console.error('Error in DELETE /api/profile/skills/endorsements:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
