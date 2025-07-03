import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { getSupabaseClient, getSupabaseServiceClient } from '@/lib/supabase/client';

// GET /api/specialists - Get all specialists with filtering and pagination
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const categoryId = searchParams.get('categoryId');
    const rating = searchParams.get('rating') ? parseFloat(searchParams.get('rating')!) : undefined;
    const location = searchParams.get('location');
    const latitude = searchParams.get('latitude') ? parseFloat(searchParams.get('latitude')!) : undefined;
    const longitude = searchParams.get('longitude') ? parseFloat(searchParams.get('longitude')!) : undefined;
    const radius = searchParams.get('radius') ? parseInt(searchParams.get('radius')!) : undefined;
    const sortBy = searchParams.get('sortBy') || 'rating'; // rating, distance, price
    const sortOrder = searchParams.get('sortOrder') || 'desc'; // asc, desc

    // Build filter conditions
    const filters: any = {
      user: {
        isActive: true,
        isVerified: true,
      },
    };

    // Filter by category
    if (categoryId) {
      filters.services = {
        some: {
          serviceCategoryId: categoryId,
        },
      };
    }

    // Filter by rating
    if (rating) {
      filters.averageRating = {
        gte: rating,
      };
    }

    // Filter by location (text-based)
    if (location) {
      filters.OR = [
        { city: { contains: location, mode: 'insensitive' } },
        { state: { contains: location, mode: 'insensitive' } },
        { zipCode: { contains: location, mode: 'insensitive' } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    const supabase = getSupabaseServiceClient();
    
    // Build Supabase query for specialists
    let query = supabase
      .from('specialistProfiles')
      .select(`
        *,
        user:userId(id, firstName, lastName, email, profileImageUrl, createdAt),
        services:id(*, serviceCategory:serviceCategoryId(*)),
        certifications:id(*)
      `)
      .eq('user.isActive', true)
      .eq('user.isVerified', true)
      .range(skip, skip + limit - 1);
      
    // Apply filters
    if (categoryId) {
      // This is a simplification - in Supabase we might need a join or subquery
      // For now, we'll filter the results after fetching
    }
    
    if (rating) {
      query = query.gte('averageRating', rating);
    }
    
    if (location) {
      // Supabase doesn't have a direct equivalent to Prisma's OR with contains
      // We'll use ilike for case-insensitive search
      query = query.or(`city.ilike.%${location}%,state.ilike.%${location}%,zipCode.ilike.%${location}%`);
    }
    
    // Apply sorting
    if (sortBy === 'rating') {
      query = query.order('averageRating', { ascending: sortOrder === 'asc' });
    } else {
      query = query.order('createdAt', { ascending: sortOrder === 'asc' });
    }
    
    const { data: specialists, error } = await query;
    
    if (error) {
      console.error('Error fetching specialists:', error);
      return NextResponse.json(
        { message: 'Failed to fetch specialists' },
        { status: 500 }
      );
    }
    
    // Get total count for pagination
    const { count: totalCount, error: countError } = await supabase
      .from('specialistProfiles')
      .select('*', { count: 'exact', head: true })
      .eq('user.isActive', true)
      .eq('user.isVerified', true);
      
    if (countError) {
      console.error('Error counting specialists:', countError);
    }

    // Calculate distance if coordinates are provided
    let specialistsWithDistance = specialists;
    if (latitude && longitude && radius) {
      // Filter specialists by distance
      specialistsWithDistance = specialists.filter(specialist => {
        if (!specialist.latitude || !specialist.longitude) return false;
        
        // Calculate distance using Haversine formula
        const R = 6371; // Earth radius in km
        const dLat = (specialist.latitude - latitude) * Math.PI / 180;
        const dLon = (specialist.longitude - longitude) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(latitude * Math.PI / 180) * Math.cos(specialist.latitude * Math.PI / 180) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        
        // Add distance to specialist object
        (specialist as any).distance = distance;
        
        // Return true if within radius
        return distance <= radius;
      });
      
      // Sort by distance if requested
      if (sortBy === 'distance') {
        specialistsWithDistance.sort((a, b) => {
          return sortOrder === 'asc' 
            ? (a as any).distance - (b as any).distance
            : (b as any).distance - (a as any).distance;
        });
      }
    }

    // Ensure totalCount is not null for pagination
    const safeCount = totalCount || 0;
    
    return NextResponse.json({
      specialists: specialistsWithDistance,
      pagination: {
        page,
        limit,
        totalCount: safeCount,
        totalPages: Math.ceil(safeCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching specialists:', error);
    return NextResponse.json(
      { message: 'Failed to fetch specialists' },
      { status: 500 }
    );
  }
}

// POST /api/specialists - Create or update specialist profile (for authenticated specialists only)
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only specialists can create/update their profile
    if (user.role !== 'SPECIALIST') {
      return NextResponse.json(
        { message: 'Only specialists can update specialist profiles' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      businessName,
      businessDescription,
      yearsOfExperience,
      address,
      city,
      state,
      zipCode,
      country,
      latitude,
      longitude,
      serviceRadius,
      availabilityStatus,
      hourlyRate,
      services,
    } = body;

    const supabase = getSupabaseServiceClient();
    
    // Check if specialist profile exists
    const { data: existingProfile, error: profileError } = await supabase
      .from('specialistProfiles')
      .select('id')
      .eq('userId', user.id)
      .maybeSingle();
      
    if (profileError) {
      console.error('Error checking specialist profile:', profileError);
      return NextResponse.json(
        { message: 'Failed to check specialist profile' },
        { status: 500 }
      );
    }

    let specialistProfile;

    if (existingProfile) {
      // Update existing profile
      const { data: updatedProfile, error: updateError } = await supabase
        .from('specialistProfiles')
        .update({
          businessName,
          businessDescription,
          yearsOfExperience,
          address,
          city,
          state,
          zipCode,
          country,
          latitude,
          longitude,
          serviceRadius,
          availabilityStatus,
          hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined,
        })
        .eq('userId', user.id)
        .select();
        
      if (updateError) {
        console.error('Error updating specialist profile:', updateError);
        return NextResponse.json(
          { message: 'Failed to update specialist profile' },
          { status: 500 }
        );
      }
      
      specialistProfile = updatedProfile;
    } else {
      // Create new profile
      const { data: newProfile, error: createError } = await supabase
        .from('specialistProfiles')
        .insert({
          userId: user.id,
          businessName,
          businessDescription,
          yearsOfExperience,
          address,
          city,
          state,
          zipCode,
          country,
          latitude,
          longitude,
          serviceRadius,
          availabilityStatus: availabilityStatus || 'offline',
          hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined,
        })
        .select()
        .single();
        
      if (createError) {
        console.error('Error creating specialist profile:', createError);
        return NextResponse.json(
          { message: 'Failed to create specialist profile' },
          { status: 500 }
        );
      }
      
      specialistProfile = newProfile;
    }

    // Handle services if provided
    if (services && Array.isArray(services) && specialistProfile) {
      // Delete existing services first
      const { error: deleteServicesError } = await supabase
        .from('specialistServices')
        .delete()
        .eq('specialistId', specialistProfile.id);
        
      if (deleteServicesError) {
        console.error('Error deleting specialist services:', deleteServicesError);
        // Continue anyway since the profile was updated/created
      }

      // Create new services
      for (const service of services) {
        const { error: createServiceError } = await supabase
          .from('specialistServices')
          .insert({
            specialistId: specialistProfile.id,
            serviceCategoryId: service.categoryId,
            priceType: service.priceType,
            basePrice: service.basePrice ? parseFloat(service.basePrice) : null,
            description: service.description,
            isPrimary: service.isPrimary || false,
          });
          
        if (createServiceError) {
          console.error('Error creating specialist service:', createServiceError);
          // Continue with other services
        }
      }
    }

    // Get the updated specialist profile with all related data
    const { data: updatedProfile, error: fetchError } = await supabase
      .from('specialistProfiles')
      .select(`
        *,
        user:userId(id, firstName, lastName, email, profileImageUrl),
        services:id(*)
      `)
      .eq('id', specialistProfile?.id || '')
      .single();
      
    if (fetchError) {
      console.error('Error fetching updated specialist profile:', fetchError);
    }

    return NextResponse.json({
      message: existingProfile ? 'Profile updated successfully' : 'Profile created successfully',
      specialistProfile: updatedProfile || specialistProfile,
    });
  } catch (error) {
    console.error('Error creating/updating specialist profile:', error);
    return NextResponse.json(
      { message: 'Failed to create/update specialist profile' },
      { status: 500 }
    );
  }
}
