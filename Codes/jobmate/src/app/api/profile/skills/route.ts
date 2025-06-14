import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

    const userSkills = await prisma.userSkill.findMany({
      where: { userId: user.id },
      include: {
        skill: true,
        endorsements: {
          include: {
            endorser: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImageUrl: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({ userSkills }, { status: 200 });
  } catch (error) {
    console.error('Get skills error:', error);
    return NextResponse.json(
      { message: 'Failed to get skills' },
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

    const data = await req.json();
    const { skillId, proficiencyLevel, yearsExperience } = data;

    // Validate required fields
    if (!skillId) {
      return NextResponse.json(
        { message: 'Skill ID is required' },
        { status: 400 }
      );
    }

    // Check if the skill exists
    const skill = await prisma.skill.findUnique({
      where: { id: skillId }
    });

    if (!skill) {
      return NextResponse.json(
        { message: 'Skill not found' },
        { status: 404 }
      );
    }

    // Check if the user already has this skill
    const existingUserSkill = await prisma.userSkill.findFirst({
      where: {
        userId: user.id,
        skillId
      }
    });

    if (existingUserSkill) {
      return NextResponse.json(
        { message: 'User already has this skill' },
        { status: 409 }
      );
    }

    // Add the skill to the user
    const userSkill = await prisma.userSkill.create({
      data: {
        userId: user.id,
        skillId,
        proficiencyLevel: proficiencyLevel || 1,
        yearsExperience: yearsExperience ? parseFloat(yearsExperience) : null
      },
      include: {
        skill: true
      }
    });

    return NextResponse.json({
      message: 'Skill added successfully',
      userSkill
    }, { status: 201 });
  } catch (error) {
    console.error('Add skill error:', error);
    return NextResponse.json(
      { message: 'Failed to add skill' },
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

    const data = await req.json();
    const { skills } = data;

    if (!Array.isArray(skills)) {
      return NextResponse.json(
        { message: 'Skills must be an array' },
        { status: 400 }
      );
    }

    // Process each skill in the array
    const results = await Promise.all(
      skills.map(async (skill) => {
        const { id, skillId, proficiencyLevel, yearsExperience } = skill;

        if (id) {
          // Update existing user skill
          const existingUserSkill = await prisma.userSkill.findFirst({
            where: {
              id,
              userId: user.id // Ensure the skill belongs to the user
            }
          });

          if (!existingUserSkill) {
            return { 
              success: false, 
              message: `User skill with ID ${id} not found or doesn't belong to this user` 
            };
          }

          const updatedUserSkill = await prisma.userSkill.update({
            where: { id },
            data: {
              proficiencyLevel,
              yearsExperience: yearsExperience ? parseFloat(yearsExperience) : null
            },
            include: {
              skill: true
            }
          });

          return { success: true, userSkill: updatedUserSkill };
        } else if (skillId) {
          // Add new skill
          // Check if the skill exists
          const skillExists = await prisma.skill.findUnique({
            where: { id: skillId }
          });

          if (!skillExists) {
            return { 
              success: false, 
              message: `Skill with ID ${skillId} not found` 
            };
          }

          // Check if the user already has this skill
          const existingUserSkill = await prisma.userSkill.findFirst({
            where: {
              userId: user.id,
              skillId
            }
          });

          if (existingUserSkill) {
            return { 
              success: false, 
              message: 'User already has this skill' 
            };
          }

          // Add the skill to the user
          const newUserSkill = await prisma.userSkill.create({
            data: {
              userId: user.id,
              skillId,
              proficiencyLevel: proficiencyLevel || 1,
              yearsExperience: yearsExperience ? parseFloat(yearsExperience) : null
            },
            include: {
              skill: true
            }
          });

          return { success: true, userSkill: newUserSkill };
        } else {
          return { 
            success: false, 
            message: 'Either skill ID or user skill ID is required' 
          };
        }
      })
    );

    // Get all updated user skills
    const updatedUserSkills = await prisma.userSkill.findMany({
      where: { userId: user.id },
      include: {
        skill: true
      }
    });

    return NextResponse.json({
      message: 'Skills updated',
      results,
      userSkills: updatedUserSkills
    }, { status: 200 });
  } catch (error) {
    console.error('Update skills error:', error);
    return NextResponse.json(
      { message: 'Failed to update skills' },
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

    // Get the skill ID from the URL search params
    const { searchParams } = new URL(req.url);
    const userSkillId = searchParams.get('id');
    const skillId = searchParams.get('skillId');

    if (!userSkillId && !skillId) {
      return NextResponse.json(
        { message: 'Either user skill ID or skill ID is required' },
        { status: 400 }
      );
    }

    let deleteResult;

    if (userSkillId) {
      // Delete by user skill ID
      const userSkill = await prisma.userSkill.findFirst({
        where: {
          id: userSkillId,
          userId: user.id // Ensure the skill belongs to the user
        }
      });

      if (!userSkill) {
        return NextResponse.json(
          { message: `User skill with ID ${userSkillId} not found or doesn't belong to this user` },
          { status: 404 }
        );
      }

      deleteResult = await prisma.userSkill.delete({
        where: { id: userSkillId }
      });
    } else {
      // Delete by skill ID
      const userSkill = await prisma.userSkill.findFirst({
        where: {
          skillId: skillId,
          userId: user.id // Ensure the skill belongs to the user
        }
      });

      if (!userSkill) {
        return NextResponse.json(
          { message: `User skill with skill ID ${skillId} not found or doesn't belong to this user` },
          { status: 404 }
        );
      }

      deleteResult = await prisma.userSkill.delete({
        where: { id: userSkill.id }
      });
    }

    return NextResponse.json({
      message: 'Skill removed successfully',
      deletedSkill: deleteResult
    }, { status: 200 });
  } catch (error) {
    console.error('Delete skill error:', error);
    return NextResponse.json(
      { message: 'Failed to remove skill' },
      { status: 500 }
    );
  }
}
