import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { getSupabaseClient, getSupabaseServiceClient } from '@/lib/supabase/client';

// GET /api/categories - Get all service categories
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const parentId = searchParams.get('parentId');
    const popular = searchParams.get('popular');
    const includeInactive = searchParams.get('includeInactive') === 'true';
    
    // Build the query
    const query: any = {};
    
    // Filter by parent category if specified
    if (parentId) {
      query.parentCategoryId = parentId;
    } else if (parentId === 'null') {
      // Explicitly requesting root categories
      query.parentCategoryId = null;
    }
    
    // Filter by popularity if requested
    if (popular === 'true') {
      query.isPopular = true;
    }
    
    // Only include active categories unless explicitly requested
    if (!includeInactive) {
      query.isActive = true;
    }
    
    const supabase = getSupabaseServiceClient();
    
    // Build the Supabase query
    let categoriesQuery = supabase
      .from('serviceCategories')
      .select(`
        *,
        childCategories:id(*)
      `)
      .order('displayOrder', { ascending: true })
      .order('name', { ascending: true });
      
    // Apply filters
    if (parentId) {
      categoriesQuery = categoriesQuery.eq('parentCategoryId', parentId);
    } else if (parentId === 'null') {
      categoriesQuery = categoriesQuery.is('parentCategoryId', null);
    }
    
    if (popular === 'true') {
      categoriesQuery = categoriesQuery.eq('isPopular', true);
    }
    
    if (!includeInactive) {
      categoriesQuery = categoriesQuery.eq('isActive', true);
    }
    
    const { data: categories, error } = await categoriesQuery;
    
    if (error) {
      console.error('Error fetching categories:', error);
      return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
    
    // Get counts for each category
    const categoriesWithCounts = await Promise.all(categories.map(async (category) => {
      // Get job count
      const { count: jobCount, error: jobError } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('serviceCategoryId', category.id);
        
      // Get child categories count
      const { count: childCount, error: childError } = await supabase
        .from('serviceCategories')
        .select('*', { count: 'exact', head: true })
        .eq('parentCategoryId', category.id)
        .eq('isActive', true);
        
      // Get specialist services count
      const { count: serviceCount, error: serviceError } = await supabase
        .from('specialistServices')
        .select('*', { count: 'exact', head: true })
        .eq('serviceCategoryId', category.id);
        
      // Get skills count
      const { count: skillCount, error: skillError } = await supabase
        .from('skills')
        .select('*', { count: 'exact', head: true })
        .eq('serviceCategoryId', category.id);
      
      // Filter child categories to only include active ones with selected fields
      const filteredChildren = category.childCategories
        .filter((child: any) => child.isActive)
        .map((child: any) => ({
          id: child.id,
          name: child.name,
          slug: child.slug,
          iconUrl: child.iconUrl,
          emoji: child.emoji
        }))
        .sort((a: any, b: any) => {
          // Sort by displayOrder first, then by name
          if (a.displayOrder !== b.displayOrder) {
            return a.displayOrder - b.displayOrder;
          }
          return a.name.localeCompare(b.name);
        });
      
      return {
        ...category,
        childCategories: filteredChildren,
        _count: {
          jobs: jobCount || 0,
          childCategories: childCount || 0,
          specialistServices: serviceCount || 0,
          skills: skillCount || 0
        }
      };
    }));

    return NextResponse.json(categoriesWithCounts);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { message: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create a new service category (admin only)
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only admins can create categories
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Only administrators can create categories' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { 
      name, 
      description, 
      iconUrl,
      slug,
      coverImageUrl,
      emoji,
      color,
      parentCategoryId,
      displayOrder,
      isPopular,
      isActive,
      metaTags 
    } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { message: 'Category name is required' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    const categorySlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    const supabase = getSupabaseServiceClient();
    
    // Check if category with this slug already exists
    const { data: existingCategoryBySlug, error: slugError } = await supabase
      .from('serviceCategories')
      .select('id')
      .eq('slug', categorySlug)
      .maybeSingle();
      
    // Check if category with this name already exists (case insensitive)
    const { data: existingCategoryByName, error: nameError } = await supabase
      .from('serviceCategories')
      .select('id')
      .ilike('name', name)
      .maybeSingle();
      
    // Combine the results
    const existingCategory = existingCategoryBySlug || existingCategoryByName;

    if (existingCategory) {
      return NextResponse.json(
        { message: 'A category with this name or slug already exists' },
        { status: 409 }
      );
    }

    // If parent category is specified, check if it exists
    if (parentCategoryId) {
      const { data: parentCategory, error: parentError } = await supabase
        .from('serviceCategories')
        .select('id')
        .eq('id', parentCategoryId)
        .maybeSingle();

      if (parentError || !parentCategory) {
        return NextResponse.json(
          { message: 'Parent category not found' },
          { status: 404 }
        );
      }
    }

    // Create the category with all the new fields
    const { data: category, error: createError } = await supabase
      .from('serviceCategories')
      .insert({
        name,
        slug: categorySlug,
        description,
        iconUrl,
        coverImageUrl,
        emoji,
        color,
        parentCategoryId,
        displayOrder: displayOrder || 0,
        isPopular: isPopular || false,
        isActive: isActive !== undefined ? isActive : true,
        metaTags: metaTags || []
      })
      .select()
      .single();
      
    if (createError) {
      console.error('Error creating category:', createError);
      return NextResponse.json(
        { message: 'Failed to create category' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Category created successfully', category },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { message: 'Failed to create category' },
      { status: 500 }
    );
  }
}
