import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/profile/socials
 * Get all social links for the current user
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

    const socialLinks = await prisma.userSocialLink.findMany({
      where: { userId: user.id }
    });

    return NextResponse.json({ socialLinks }, { status: 200 });
  } catch (error) {
    console.error('Get social links error:', error);
    return NextResponse.json(
      { message: 'Failed to get social links' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/profile/socials
 * Add a new social link for the current user
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
    const { platform, url, username, isPublic } = data;

    // Validate required fields
    if (!platform || !url) {
      return NextResponse.json(
        { message: 'Platform and URL are required' },
        { status: 400 }
      );
    }

    // Check if this platform already exists for the user
    const existingSocialLink = await prisma.userSocialLink.findFirst({
      where: {
        userId: user.id,
        platform
      }
    });

    if (existingSocialLink) {
      return NextResponse.json(
        { message: `A ${platform} link already exists for this user` },
        { status: 409 }
      );
    }

    // Create the new social link
    const socialLink = await prisma.userSocialLink.create({
      data: {
        userId: user.id,
        platform,
        url,
        username,
        isPublic: isPublic !== undefined ? isPublic : true
      }
    });

    return NextResponse.json({
      message: 'Social link added successfully',
      socialLink
    }, { status: 201 });
  } catch (error) {
    console.error('Add social link error:', error);
    return NextResponse.json(
      { message: 'Failed to add social link' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/profile/socials
 * Update multiple social links at once
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
    const { socialLinks } = data;

    if (!Array.isArray(socialLinks)) {
      return NextResponse.json(
        { message: 'socialLinks must be an array' },
        { status: 400 }
      );
    }

    // Process each social link in the array
    const results = await Promise.all(
      socialLinks.map(async (link) => {
        const { id, platform, url, username, isPublic } = link;

        if (id) {
          // Update existing link
          const existingLink = await prisma.userSocialLink.findFirst({
            where: {
              id,
              userId: user.id // Ensure the link belongs to the user
            }
          });

          if (!existingLink) {
            return { 
              success: false, 
              message: `Social link with ID ${id} not found or doesn't belong to this user` 
            };
          }

          const updatedLink = await prisma.userSocialLink.update({
            where: { id },
            data: {
              platform,
              url,
              username,
              isPublic
            }
          });

          return { success: true, socialLink: updatedLink };
        } else {
          // Create new link
          if (!platform || !url) {
            return { 
              success: false, 
              message: 'Platform and URL are required for new social links' 
            };
          }

          // Check if this platform already exists for the user
          const existingLink = await prisma.userSocialLink.findFirst({
            where: {
              userId: user.id,
              platform
            }
          });

          if (existingLink) {
            return { 
              success: false, 
              message: `A ${platform} link already exists for this user` 
            };
          }

          const newLink = await prisma.userSocialLink.create({
            data: {
              userId: user.id,
              platform,
              url,
              username,
              isPublic: isPublic !== undefined ? isPublic : true
            }
          });

          return { success: true, socialLink: newLink };
        }
      })
    );

    // Get all updated social links
    const updatedSocialLinks = await prisma.userSocialLink.findMany({
      where: { userId: user.id }
    });

    return NextResponse.json({
      message: 'Social links updated',
      results,
      socialLinks: updatedSocialLinks
    }, { status: 200 });
  } catch (error) {
    console.error('Update social links error:', error);
    return NextResponse.json(
      { message: 'Failed to update social links' },
      { status: 500 }
    );
  }
}
