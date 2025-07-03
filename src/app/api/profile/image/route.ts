import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { getSupabaseServiceClient } from '@/lib/supabase/client';

/**
 * POST /api/profile/image
 * Upload and update a user's profile image
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

    const formData = await req.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { message: 'No image file provided' },
        { status: 400 }
      );
    }

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { message: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Check file size (limit to 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: 'File size exceeds the 5MB limit' },
        { status: 400 }
      );
    }

    // In a real implementation, you would upload the file to a storage service
    // like AWS S3, Cloudinary, or similar, and get back a URL
    // For this example, we'll simulate this process
    
    // Convert file to buffer for processing
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Generate a unique filename
    const timestamp = Date.now();
    const filename = `profile_${user.id}_${timestamp}.${file.type.split('/')[1]}`;
    
    // In a real implementation, this is where you would upload the file
    // For now, we'll simulate getting back a URL
    const imageUrl = `/uploads/profiles/${filename}`;
    
    // Update the user's profile image URL in the database
    const supabase = getSupabaseServiceClient();
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({
        profileImageUrl: imageUrl,
        updatedAt: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user profile image:', error);
      return NextResponse.json(
        { message: 'Failed to update profile image in database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Profile image updated successfully',
      imageUrl
    }, { status: 200 });
  } catch (error) {
    console.error('Profile image upload error:', error);
    return NextResponse.json(
      { message: 'Failed to upload profile image' },
      { status: 500 }
    );
  }
}
