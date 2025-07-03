import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { getSupabaseServiceClient } from '@/lib/supabase/client';

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

    const supabase = getSupabaseServiceClient();
    
    const { data: socialLinks, error } = await supabase
      .from('userSocialLinks')
      .select('*')
      .eq('userId', user.id);

    if (error) {
      console.error('Error fetching social links:', error);
      return NextResponse.json(
        { message: 'Failed to get social links' },
        { status: 500 }
      );
    }

    return NextResponse.json({ socialLinks: socialLinks || [] }, { status: 200 });
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

    const body = await req.json();
    const { platform, url } = body;

    if (!platform || !url) {
      return NextResponse.json(
        { message: 'Platform and URL are required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServiceClient();
    
    // Check if user already has a link for this platform
    const { data: existingLink, error: checkError } = await supabase
      .from('userSocialLinks')
      .select('id')
      .eq('userId', user.id)
      .eq('platform', platform)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking existing social link:', checkError);
      return NextResponse.json(
        { message: 'Failed to check existing social link' },
        { status: 500 }
      );
    }
    
    if (existingLink) {
      return NextResponse.json(
        { message: `You already have a ${platform} link` },
        { status: 400 }
      );
    }

    // Create new social link
    const { data: socialLink, error: createError } = await supabase
      .from('userSocialLinks')
      .insert({
        userId: user.id,
        platform,
        url
      })
      .select()
      .single();
    
    if (createError || !socialLink) {
      console.error('Error creating social link:', createError);
      return NextResponse.json(
        { message: 'Failed to create social link' },
        { status: 500 }
      );
    }

    return NextResponse.json({ socialLink }, { status: 201 });
  } catch (error) {
    console.error('Create social link error:', error);
    return NextResponse.json(
      { message: 'Failed to create social link' },
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

    const body = await req.json();
    const { socialLinks } = body;

    if (!Array.isArray(socialLinks)) {
      return NextResponse.json(
        { message: 'Invalid request format' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServiceClient();
    const updatedLinks = [];
    const createdLinks = [];
    
    // Process each social link
    for (const link of socialLinks) {
      const { id, platform, url } = link;
      
      if (!platform || !url) {
        continue; // Skip invalid links
      }
      
      if (id) {
        // Update existing link
        // Verify the link belongs to the user
        const { data: existingLink, error: checkError } = await supabase
          .from('userSocialLinks')
          .select('id')
          .eq('id', id)
          .eq('userId', user.id)
          .maybeSingle();
        
        if (checkError || !existingLink) {
          console.error(`Error verifying social link ${id}:`, checkError);
          continue; // Skip this link
        }
        
        // Update the link
        const { data: updatedLink, error: updateError } = await supabase
          .from('userSocialLinks')
          .update({
            platform,
            url,
            updatedAt: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();
        
        if (updateError || !updatedLink) {
          console.error(`Error updating social link ${id}:`, updateError);
          continue; // Skip this link
        }
        
        updatedLinks.push(updatedLink);
      } else {
        // Create new link
        // Check if user already has a link for this platform
        const { data: existingPlatformLink, error: checkPlatformError } = await supabase
          .from('userSocialLinks')
          .select('id')
          .eq('userId', user.id)
          .eq('platform', platform)
          .maybeSingle();
        
        if (checkPlatformError) {
          console.error(`Error checking existing ${platform} link:`, checkPlatformError);
          continue; // Skip this link
        }
        
        if (existingPlatformLink) {
          // Update existing platform link instead of creating a new one
          const { data: updatedPlatformLink, error: updatePlatformError } = await supabase
            .from('userSocialLinks')
            .update({
              url,
              updatedAt: new Date().toISOString()
            })
            .eq('id', existingPlatformLink.id)
            .select()
            .single();
          
          if (updatePlatformError || !updatedPlatformLink) {
            console.error(`Error updating existing ${platform} link:`, updatePlatformError);
            continue; // Skip this link
          }
          
          updatedLinks.push(updatedPlatformLink);
        } else {
          // Create new link
          const { data: newLink, error: createError } = await supabase
            .from('userSocialLinks')
            .insert({
              userId: user.id,
              platform,
              url
            })
            .select()
            .single();
          
          if (createError || !newLink) {
            console.error(`Error creating ${platform} link:`, createError);
            continue; // Skip this link
          }
          
          createdLinks.push(newLink);
        }
      }
    }
    
    // Get all user social links after updates
    const { data: allSocialLinks, error: fetchError } = await supabase
      .from('userSocialLinks')
      .select('*')
      .eq('userId', user.id);
    
    if (fetchError) {
      console.error('Error fetching updated social links:', fetchError);
      return NextResponse.json({
        message: 'Some links updated but failed to fetch all links',
        updated: updatedLinks.length,
        created: createdLinks.length
      }, { status: 207 });
    }
    
    return NextResponse.json({
      socialLinks: allSocialLinks || [],
      updated: updatedLinks.length,
      created: createdLinks.length
    }, { status: 200 });
  } catch (error) {
    console.error('Update social links error:', error);
    return NextResponse.json(
      { message: 'Failed to update social links' },
      { status: 500 }
    );
  }
}
