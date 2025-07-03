import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase/client';
import { getUserFromRequest } from '@/lib/auth';

// GET /api/specialists/[id] - Get specialist profile by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const specialistId = params.id;
    const supabase = getSupabaseServiceClient();

    // Get the specialist profile with related information
    const { data: user, error: userError } = await supabase
      .from('users')
      .select(`
        id,
        email,
        firstName,
        lastName,
        profileImageUrl,
        bio,
        title,
        role,
        createdAt,
        updatedAt,
        specialistProfiles!inner (
          id,
          hourlyRate,
          availability,
          yearsOfExperience,
          education,
          languages,
          location,
          isVerified,
          rating,
          completedJobs,
          services:specialistServices (
            id,
            title,
            description,
            price,
            duration,
            categoryId,
            serviceCategories:categoryId (
              id,
              name,
              slug,
              icon
            )
          ),
          certifications:specialistCertifications (
            id,
            name,
            issuer,
            issueDate,
            expirationDate,
            credentialId,
            credentialUrl
          )
        )
      `)
      .eq('id', specialistId)
      .eq('role', 'SPECIALIST')
      .single();

    if (userError || !user) {
      console.error('Error fetching specialist:', userError);
      return NextResponse.json(
        { message: 'Specialist not found' },
        { status: 404 }
      );
    }

    // Get reviews for the specialist
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select(`
        id,
        rating,
        comment,
        createdAt,
        reviewer:reviewerId (
          id,
          firstName,
          lastName,
          profileImageUrl
        )
      `)
      .eq('userId', specialistId)
      .order('createdAt', { ascending: false })
      .limit(5);

    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError);
      // Continue despite error
    }

    // Get skills for the specialist
    const { data: skills, error: skillsError } = await supabase
      .from('userSkills')
      .select(`
        id,
        proficiency,
        yearsOfExperience,
        isHighlighted,
        skills:skillId (
          id,
          name,
          category
        )
      `)
      .eq('userId', specialistId);

    if (skillsError) {
      console.error('Error fetching skills:', skillsError);
      // Continue despite error
    }

    // Format the response
    const specialist = {
      ...user,
      specialistProfile: {
        ...user.specialistProfiles,
        services: user.specialistProfiles.services || [],
        certifications: user.specialistProfiles.certifications || []
      },
      skills: skills || [],
      reviews: reviews || []
    };

    // Remove the redundant nested specialistProfiles property
    delete specialist.specialistProfiles;

    return NextResponse.json({ specialist });
  } catch (error) {
    console.error('Error fetching specialist profile:', error);
    return NextResponse.json(
      { message: 'Failed to fetch specialist profile' },
      { status: 500 }
    );
  }
}

// PATCH /api/specialists/[id] - Update specialist profile (only for the specialist themselves)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const specialistId = params.id;
    const currentUser = await getUserFromRequest(req);

    if (!currentUser) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify the user is updating their own profile
    if (currentUser.id !== specialistId) {
      return NextResponse.json(
        { message: 'You can only update your own profile' },
        { status: 403 }
      );
    }

    // Verify the user is a specialist
    if (currentUser.role !== 'SPECIALIST') {
      return NextResponse.json(
        { message: 'Only specialists can update specialist profiles' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      bio,
      title,
      hourlyRate,
      availability,
      yearsOfExperience,
      education,
      languages,
      location
    } = body;

    const supabase = getSupabaseServiceClient();

    // Update user fields (bio, title)
    const userUpdateData: any = {};
    if (bio !== undefined) userUpdateData.bio = bio;
    if (title !== undefined) userUpdateData.title = title;

    if (Object.keys(userUpdateData).length > 0) {
      userUpdateData.updatedAt = new Date().toISOString();
      
      const { error: userUpdateError } = await supabase
        .from('users')
        .update(userUpdateData)
        .eq('id', specialistId);

      if (userUpdateError) {
        console.error('Error updating user:', userUpdateError);
        return NextResponse.json(
          { message: 'Failed to update user profile' },
          { status: 500 }
        );
      }
    }

    // Update specialist profile fields
    const profileUpdateData: any = {};
    if (hourlyRate !== undefined) profileUpdateData.hourlyRate = hourlyRate;
    if (availability !== undefined) profileUpdateData.availability = availability;
    if (yearsOfExperience !== undefined) profileUpdateData.yearsOfExperience = yearsOfExperience;
    if (education !== undefined) profileUpdateData.education = education;
    if (languages !== undefined) profileUpdateData.languages = languages;
    if (location !== undefined) profileUpdateData.location = location;

    if (Object.keys(profileUpdateData).length > 0) {
      profileUpdateData.updatedAt = new Date().toISOString();
      
      const { error: profileUpdateError } = await supabase
        .from('specialistProfiles')
        .update(profileUpdateData)
        .eq('userId', specialistId);

      if (profileUpdateError) {
        console.error('Error updating specialist profile:', profileUpdateError);
        return NextResponse.json(
          { message: 'Failed to update specialist profile' },
          { status: 500 }
        );
      }
    }

    // Get the updated specialist profile
    const { data: updatedUser, error: fetchError } = await supabase
      .from('users')
      .select(`
        id,
        email,
        firstName,
        lastName,
        profileImageUrl,
        bio,
        title,
        role,
        createdAt,
        updatedAt,
        specialistProfiles (
          id,
          hourlyRate,
          availability,
          yearsOfExperience,
          education,
          languages,
          location,
          isVerified,
          rating,
          completedJobs
        )
      `)
      .eq('id', specialistId)
      .single();

    if (fetchError || !updatedUser) {
      console.error('Error fetching updated specialist:', fetchError);
      return NextResponse.json(
        { message: 'Profile updated but failed to fetch updated data' },
        { status: 207 }
      );
    }

    // Format the response
    const specialist = {
      ...updatedUser,
      specialistProfile: updatedUser.specialistProfiles
    };

    // Remove the redundant nested specialistProfiles property
    delete specialist.specialistProfiles;

    return NextResponse.json({ specialist });
  } catch (error) {
    console.error('Error updating specialist profile:', error);
    return NextResponse.json(
      { message: 'Failed to update specialist profile' },
      { status: 500 }
    );
  }
}
