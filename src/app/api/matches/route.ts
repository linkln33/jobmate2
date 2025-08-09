import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { matchingService } from '@/services/server/matching-service';
import { getSupabaseServiceClient } from '@/lib/supabase/client';

// Mock database for preferences (in production this would use Supabase)
const preferenceDb = new Map<string, any>();

// POST /api/matches - Get job matches for a specialist with scoring
export async function POST(req: NextRequest) {
  try {
    // Authenticate the user
    const user = await getUserFromRequest(req);
    
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    const {
      specialistId,
      filters = {},
      preferences = {},
      pagination = { page: 1, limit: 10 }
    } = body;

    // Validate specialist ID
    const targetSpecialistId = specialistId || user.id;
    
    // Check if the user is authorized to view matches for this specialist
    if (targetSpecialistId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized to view matches for this specialist' },
        { status: 403 }
      );
    }

    const supabase = getSupabaseServiceClient();
    
    // Get specialist profile with skills
    const { data: specialist, error: specialistError } = await supabase
      .from('users')
      .select(`
        id,
        firstName,
        lastName,
        email,
        role,
        specialistProfiles (
          id,
          hourlyRate,
          availability,
          yearsOfExperience,
          education,
          languages,
          location
        ),
        userSkills (
          id,
          proficiency,
          yearsOfExperience,
          skills:skillId (
            id,
            name,
            category
          )
        )
      `)
      .eq('id', targetSpecialistId)
      .eq('role', 'SPECIALIST')
      .single();
    
    if (specialistError || !specialist) {
      console.error('Error fetching specialist:', specialistError);
      return NextResponse.json(
        { message: 'Specialist not found' },
        { status: 404 }
      );
    }

    // Get active job listings
    const { data: jobListings, error: jobsError } = await supabase
      .from('jobListings')
      .select(`
        id,
        title,
        description,
        budget,
        location,
        remote,
        skills,
        categoryId,
        serviceCategories:categoryId (
          id,
          name,
          slug
        ),
        createdAt,
        deadline,
        status,
        users:userId (
          id,
          firstName,
          lastName,
          profileImageUrl
        )
      `)
      .eq('status', 'ACTIVE')
      .order('createdAt', { ascending: false });
    
    if (jobsError) {
      console.error('Error fetching job listings:', jobsError);
      return NextResponse.json(
        { message: 'Failed to fetch job listings' },
        { status: 500 }
      );
    }

    // Store or retrieve user preferences
    if (Object.keys(preferences).length > 0) {
      preferenceDb.set(targetSpecialistId, preferences);
    }
    
    const userPreferences = preferenceDb.get(targetSpecialistId) || {};
    
    // Convert specialist to the expected type
    const specialistData = {
      id: specialist.id,
      user: {
        firstName: specialist.firstName,
        lastName: specialist.lastName
      },
      skills: specialist.userSkills?.map(userSkill => ({
        id: userSkill.skills?.[0]?.id || userSkill.id,
        name: userSkill.skills?.[0]?.name || ''
      })) || [],
      location: specialist.specialistProfiles?.[0]?.location,
      hourlyRate: specialist.specialistProfiles?.[0]?.hourlyRate
    };
    
    // Calculate matches with scores
    const matchesPromise = matchingService.calculateMatchesForSpecialist(
      specialistData,
      jobListings || [],
      userPreferences
    );
    
    // Await the promise to get the actual matches
    const matches = await matchesPromise;
    
    // Apply pagination
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const startIndex = (page - 1) * limit;
    const paginatedMatches = matches.slice(startIndex, startIndex + limit);
    
    // Return the matches with pagination metadata
    return NextResponse.json({
      matches: paginatedMatches,
      pagination: {
        page,
        limit,
        total: matches.length,
        totalPages: Math.ceil(matches.length / limit)
      }
    });
  } catch (error) {
    console.error('Error in job matching:', error);
    return NextResponse.json(
      { message: 'Failed to process job matches' },
      { status: 500 }
    );
  }
}
