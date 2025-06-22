import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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
    
    // Get the user skill with endorsements
    const userSkill = await prisma.userSkill.findUnique({
      where: { id: userSkillId },
      include: {
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
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    if (!userSkill) {
      return NextResponse.json(
        { message: 'User skill not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      endorsements: userSkill.endorsements,
      count: userSkill.endorsements.length
    });
  } catch (error) {
    console.error('Error fetching skill endorsements:', error);
    return NextResponse.json(
      { message: 'Failed to fetch skill endorsements' },
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
    
    const data = await req.json();
    const { userSkillId, comment } = data;
    
    if (!userSkillId) {
      return NextResponse.json(
        { message: 'User skill ID is required' },
        { status: 400 }
      );
    }
    
    // Get the user skill
    const userSkill = await prisma.userSkill.findUnique({
      where: { id: userSkillId },
      include: { user: true }
    });
    
    if (!userSkill) {
      return NextResponse.json(
        { message: 'User skill not found' },
        { status: 404 }
      );
    }
    
    // Check if the user is trying to endorse their own skill
    if (userSkill.userId === user.id) {
      return NextResponse.json(
        { message: 'You cannot endorse your own skill' },
        { status: 400 }
      );
    }
    
    // Check if the user has already endorsed this skill
    const existingEndorsement = await prisma.skillEndorsement.findFirst({
      where: {
        userSkillId,
        endorserId: user.id
      }
    });
    
    if (existingEndorsement) {
      return NextResponse.json(
        { message: 'You have already endorsed this skill' },
        { status: 409 }
      );
    }
    
    // Create the endorsement
    const endorsement = await prisma.skillEndorsement.create({
      data: {
        userSkillId,
        endorserId: user.id,
        comment
      },
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
    });
    
    // Update the endorsement count on the user skill
    await prisma.userSkill.update({
      where: { id: userSkillId },
      data: {
        endorsementCount: {
          increment: 1
        }
      }
    });
    
    return NextResponse.json(
      { message: 'Skill endorsed successfully', endorsement },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error endorsing skill:', error);
    return NextResponse.json(
      { message: 'Failed to endorse skill' },
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
    
    // Get the endorsement
    const endorsement = await prisma.skillEndorsement.findUnique({
      where: { id: endorsementId }
    });
    
    if (!endorsement) {
      return NextResponse.json(
        { message: 'Endorsement not found' },
        { status: 404 }
      );
    }
    
    // Check if the user is the endorser
    if (endorsement.endorserId !== user.id) {
      return NextResponse.json(
        { message: 'You can only remove your own endorsements' },
        { status: 403 }
      );
    }
    
    // Delete the endorsement in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete the endorsement
      await tx.skillEndorsement.delete({
        where: { id: endorsementId }
      });
      
      // Update the endorsement count on the user skill
      await tx.userSkill.update({
        where: { id: endorsement.userSkillId },
        data: {
          endorsementCount: {
            decrement: 1
          }
        }
      });
    });
    
    return NextResponse.json({
      message: 'Endorsement removed successfully'
    });
  } catch (error) {
    console.error('Error removing endorsement:', error);
    return NextResponse.json(
      { message: 'Failed to remove endorsement' },
      { status: 500 }
    );
  }
}
