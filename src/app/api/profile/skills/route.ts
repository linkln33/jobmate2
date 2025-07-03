import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { getSupabaseServiceClient } from '@/lib/supabase/client';

/**
 * GET /api/profile/skills
 * Get all skills for the current user
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);

    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = getSupabaseServiceClient();
    
    // Get user skills with their related skill data and endorsements
    const { data: userSkills, error } = await supabase
      .from('userSkills')
      .select(`
        id,
        userId,
        skillId,
        proficiency,
        yearsOfExperience,
        isHighlighted,
        createdAt,
        updatedAt,
        skills:skillId (id, name, category),
        endorsements:skillEndorsements (
          id,
          endorserId,
          endorser:endorserId (id, firstName, lastName, profileImage)
        )
      `)
      .eq('userId', user.id);

    if (error) {
      console.error('Error fetching user skills:', error);
      return NextResponse.json(
        { message: 'Failed to fetch skills' },
        { status: 500 }
      );
    }

    return NextResponse.json({ skills: userSkills || [] });
  } catch (error) {
    console.error('Error in GET /api/profile/skills:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/profile/skills
 * Add a new skill for the current user
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
    const { skillId, skillName, proficiency, yearsOfExperience, isHighlighted } = body;

    const supabase = getSupabaseServiceClient();
    
    // Check if skill exists or create it
    let finalSkillId = skillId;
    
    if (!skillId && skillName) {
      // Check if skill with this name already exists
      const { data: existingSkill, error: skillCheckError } = await supabase
        .from('skills')
        .select('id')
        .ilike('name', skillName)
        .maybeSingle();
      
      if (skillCheckError) {
        console.error('Error checking existing skill:', skillCheckError);
        return NextResponse.json(
          { message: 'Failed to check existing skill' },
          { status: 500 }
        );
      }
      
      if (existingSkill) {
        finalSkillId = existingSkill.id;
      } else {
        // Create new skill
        const { data: newSkill, error: createSkillError } = await supabase
          .from('skills')
          .insert({ name: skillName })
          .select('id')
          .single();
        
        if (createSkillError || !newSkill) {
          console.error('Error creating skill:', createSkillError);
          return NextResponse.json(
            { message: 'Failed to create skill' },
            { status: 500 }
          );
        }
        
        finalSkillId = newSkill.id;
      }
    }
    
    // Check if user already has this skill
    const { data: existingUserSkill, error: checkUserSkillError } = await supabase
      .from('userSkills')
      .select('id')
      .eq('userId', user.id)
      .eq('skillId', finalSkillId)
      .maybeSingle();
    
    if (checkUserSkillError) {
      console.error('Error checking existing user skill:', checkUserSkillError);
      return NextResponse.json(
        { message: 'Failed to check existing user skill' },
        { status: 500 }
      );
    }
    
    if (existingUserSkill) {
      return NextResponse.json(
        { message: 'You already have this skill' },
        { status: 400 }
      );
    }
    
    // Add skill to user
    const { data: userSkill, error: createUserSkillError } = await supabase
      .from('userSkills')
      .insert({
        userId: user.id,
        skillId: finalSkillId,
        proficiency: proficiency || 1,
        yearsOfExperience: yearsOfExperience || 0,
        isHighlighted: isHighlighted || false
      })
      .select(`
        id,
        userId,
        skillId,
        proficiency,
        yearsOfExperience,
        isHighlighted,
        createdAt,
        updatedAt,
        skills:skillId (id, name, category)
      `)
      .single();
    
    if (createUserSkillError || !userSkill) {
      console.error('Error adding user skill:', createUserSkillError);
      return NextResponse.json(
        { message: 'Failed to add skill' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ skill: userSkill });
  } catch (error) {
    console.error('Error in POST /api/profile/skills:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/profile/skills
 * Update multiple skills at once
 */
export async function PUT(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);

    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { skills } = body;

    if (!Array.isArray(skills)) {
      return NextResponse.json(
        { message: 'Invalid request format' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServiceClient();
    const updatedSkills = [];
    
    // Process each skill update
    for (const skill of skills) {
      const { id, proficiency, yearsOfExperience, isHighlighted } = skill;
      
      // Verify the skill belongs to the user
      const { data: userSkill, error: checkError } = await supabase
        .from('userSkills')
        .select('id')
        .eq('id', id)
        .eq('userId', user.id)
        .maybeSingle();
      
      if (checkError || !userSkill) {
        console.error(`Error verifying skill ${id}:`, checkError);
        continue; // Skip this skill
      }
      
      // Update the skill
      const updateData: any = {};
      
      if (proficiency !== undefined) updateData.proficiency = proficiency;
      if (yearsOfExperience !== undefined) updateData.yearsOfExperience = yearsOfExperience;
      if (isHighlighted !== undefined) updateData.isHighlighted = isHighlighted;
      updateData.updatedAt = new Date().toISOString();
      
      const { data: updatedSkill, error: updateError } = await supabase
        .from('userSkills')
        .update(updateData)
        .eq('id', id)
        .select(`
          id,
          userId,
          skillId,
          proficiency,
          yearsOfExperience,
          isHighlighted,
          createdAt,
          updatedAt,
          skills:skillId (id, name, category)
        `)
        .single();
      
      if (updateError || !updatedSkill) {
        console.error(`Error updating skill ${id}:`, updateError);
        continue; // Skip this skill
      }
      
      updatedSkills.push(updatedSkill);
    }
    
    // Get all user skills after updates
    const { data: allUserSkills, error: fetchError } = await supabase
      .from('userSkills')
      .select(`
        id,
        userId,
        skillId,
        proficiency,
        yearsOfExperience,
        isHighlighted,
        createdAt,
        updatedAt,
        skills:skillId (id, name, category),
        endorsements:skillEndorsements (
          id,
          endorserId,
          endorser:endorserId (id, firstName, lastName, profileImage)
        )
      `)
      .eq('userId', user.id);
    
    if (fetchError) {
      console.error('Error fetching updated skills:', fetchError);
      return NextResponse.json(
        { message: 'Skills updated but failed to fetch all skills' },
        { status: 207 }
      );
    }
    
    return NextResponse.json({ 
      updatedCount: updatedSkills.length,
      skills: allUserSkills || [] 
    });
  } catch (error) {
    console.error('Error in PUT /api/profile/skills:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/profile/skills
 * Remove a skill from the current user
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

    // Get skill ID from URL
    const url = new URL(req.url);
    const skillId = url.searchParams.get('id');

    if (!skillId) {
      return NextResponse.json(
        { message: 'Skill ID is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServiceClient();
    
    // Verify the skill belongs to the user
    const { data: userSkill, error: checkError } = await supabase
      .from('userSkills')
      .select('id')
      .eq('id', skillId)
      .eq('userId', user.id)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error verifying skill:', checkError);
      return NextResponse.json(
        { message: 'Failed to verify skill' },
        { status: 500 }
      );
    }
    
    if (!userSkill) {
      return NextResponse.json(
        { message: 'Skill not found or does not belong to user' },
        { status: 404 }
      );
    }
    
    // Delete related endorsements first
    const { error: endorsementDeleteError } = await supabase
      .from('skillEndorsements')
      .delete()
      .eq('userSkillId', skillId);
    
    if (endorsementDeleteError) {
      console.error('Error deleting endorsements:', endorsementDeleteError);
      // Continue despite error
    }
    
    // Delete the skill
    const { error: deleteError } = await supabase
      .from('userSkills')
      .delete()
      .eq('id', skillId);
    
    if (deleteError) {
      console.error('Error deleting skill:', deleteError);
      return NextResponse.json(
        { message: 'Failed to delete skill' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Skill deleted successfully',
      deletedId: skillId
    });
  } catch (error) {
    console.error('Error in DELETE /api/profile/skills:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
