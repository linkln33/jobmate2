import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/profile/portfolio
 * Get portfolio items for the authenticated user
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
    
    // Get portfolio items with related category data
    const portfolioItems = await prisma.portfolioItem.findMany({
      where: {
        userId: user.id
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            iconUrl: true,
            emoji: true,
            color: true
          }
        }
      },
      orderBy: {
        displayOrder: 'asc'
      }
    });
    
    return NextResponse.json(portfolioItems);
  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    return NextResponse.json(
      { message: 'Failed to fetch portfolio items' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/profile/portfolio
 * Create a new portfolio item
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
    const { 
      title, 
      description, 
      imageUrl, 
      projectUrl, 
      categoryId,
      completionDate,
      displayOrder,
      isPublic
    } = data;
    
    // Validate required fields
    if (!title || !imageUrl) {
      return NextResponse.json(
        { message: 'Title and image URL are required' },
        { status: 400 }
      );
    }
    
    // Validate category if provided
    if (categoryId) {
      const category = await prisma.serviceCategory.findUnique({
        where: { id: categoryId }
      });
      
      if (!category) {
        return NextResponse.json(
          { message: 'Category not found' },
          { status: 404 }
        );
      }
    }
    
    // Create the portfolio item
    const portfolioItem = await prisma.portfolioItem.create({
      data: {
        userId: user.id,
        title,
        description,
        imageUrl,
        projectUrl,
        categoryId,
        completionDate: completionDate ? new Date(completionDate) : null,
        displayOrder: displayOrder || 0,
        isPublic: isPublic !== undefined ? isPublic : true
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            iconUrl: true,
            emoji: true,
            color: true
          }
        }
      }
    });
    
    return NextResponse.json(
      { message: 'Portfolio item created successfully', portfolioItem },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating portfolio item:', error);
    return NextResponse.json(
      { message: 'Failed to create portfolio item' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/profile/portfolio
 * Update multiple portfolio items (order, visibility, etc.)
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
    
    const { portfolioItems } = await req.json();
    
    if (!Array.isArray(portfolioItems) || portfolioItems.length === 0) {
      return NextResponse.json(
        { message: 'No portfolio items provided' },
        { status: 400 }
      );
    }
    
    // Update portfolio items in a transaction
    const updatedItems = await prisma.$transaction(async (tx) => {
      const results = [];
      
      for (const item of portfolioItems) {
        // Verify ownership
        const existingItem = await tx.portfolioItem.findUnique({
          where: { id: item.id }
        });
        
        if (!existingItem || existingItem.userId !== user.id) {
          throw new Error(`Unauthorized access to portfolio item ${item.id}`);
        }
        
        // Update the item
        const updatedItem = await tx.portfolioItem.update({
          where: { id: item.id },
          data: {
            title: item.title,
            description: item.description,
            imageUrl: item.imageUrl,
            projectUrl: item.projectUrl,
            categoryId: item.categoryId,
            completionDate: item.completionDate ? new Date(item.completionDate) : null,
            displayOrder: item.displayOrder,
            isPublic: item.isPublic
          },
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
                iconUrl: true,
                emoji: true,
                color: true
              }
            }
          }
        });
        
        results.push(updatedItem);
      }
      
      return results;
    });
    
    return NextResponse.json({
      message: 'Portfolio items updated successfully',
      portfolioItems: updatedItems
    });
  } catch (error) {
    console.error('Error updating portfolio items:', error);
    return NextResponse.json(
      { message: 'Failed to update portfolio items' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/profile/portfolio?id={portfolioItemId}
 * Delete a portfolio item
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
    const portfolioItemId = searchParams.get('id');
    
    if (!portfolioItemId) {
      return NextResponse.json(
        { message: 'Portfolio item ID is required' },
        { status: 400 }
      );
    }
    
    // Verify ownership
    const portfolioItem = await prisma.portfolioItem.findUnique({
      where: { id: portfolioItemId }
    });
    
    if (!portfolioItem) {
      return NextResponse.json(
        { message: 'Portfolio item not found' },
        { status: 404 }
      );
    }
    
    if (portfolioItem.userId !== user.id) {
      return NextResponse.json(
        { message: 'You do not have permission to delete this portfolio item' },
        { status: 403 }
      );
    }
    
    // Delete the portfolio item
    await prisma.portfolioItem.delete({
      where: { id: portfolioItemId }
    });
    
    return NextResponse.json({
      message: 'Portfolio item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    return NextResponse.json(
      { message: 'Failed to delete portfolio item' },
      { status: 500 }
    );
  }
}
