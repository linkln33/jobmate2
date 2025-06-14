import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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
    
    // Get categories with related data
    const categories = await prisma.serviceCategory.findMany({
      where: query,
      include: {
        _count: {
          select: {
            jobs: true,
            childCategories: true,
            specialistServices: true,
            skills: true
          },
        },
        childCategories: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            slug: true,
            iconUrl: true,
            emoji: true
          },
          orderBy: [
            { displayOrder: 'asc' },
            { name: 'asc' }
          ]
        }
      },
      orderBy: [
        { displayOrder: 'asc' },
        { name: 'asc' }
      ],
    });

    return NextResponse.json(categories);
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

    // Check if category with this slug already exists
    const existingCategory = await prisma.serviceCategory.findFirst({
      where: {
        OR: [
          { slug: categorySlug },
          { 
            name: {
              equals: name,
              mode: 'insensitive', // Case-insensitive search
            }
          }
        ]
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { message: 'A category with this name or slug already exists' },
        { status: 409 }
      );
    }

    // If parent category is specified, check if it exists
    if (parentCategoryId) {
      const parentCategory = await prisma.serviceCategory.findUnique({
        where: { id: parentCategoryId }
      });

      if (!parentCategory) {
        return NextResponse.json(
          { message: 'Parent category not found' },
          { status: 404 }
        );
      }
    }

    // Create the category with all the new fields
    const category = await prisma.serviceCategory.create({
      data: {
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
      },
    });

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
