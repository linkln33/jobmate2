import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromRequest } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/categories/[id] - Get a specific category by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = params.id;

    // Get the category with related jobs
    const category = await prisma.serviceCategory.findUnique({
      where: { id: categoryId },
      include: {
        jobs: {
          where: { status: 'OPEN' },
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            customer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImageUrl: true,
              },
            },
            jobMedia: {
              take: 1,
            },
            _count: {
              select: {
                proposals: true,
              },
            },
          },
        },
        _count: {
          select: {
            jobs: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { message: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// PATCH /api/categories/[id] - Update a category (admin only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(req);
    
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only admins can update categories
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Only administrators can update categories' },
        { status: 403 }
      );
    }

    const categoryId = params.id;
    const body = await req.json();
    const { name, description, iconUrl } = body;

    // Check if category exists
    const existingCategory = await prisma.serviceCategory.findUnique({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if name is being changed and if it conflicts with another category
    if (name && name !== existingCategory.name) {
      const nameConflict = await prisma.serviceCategory.findFirst({
        where: {
          name: {
            equals: name,
            mode: 'insensitive', // Case-insensitive search
          },
          id: {
            not: categoryId,
          },
        },
      });

      if (nameConflict) {
        return NextResponse.json(
          { message: 'A category with this name already exists' },
          { status: 409 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (iconUrl !== undefined) updateData.iconUrl = iconUrl;

    // Update the category
    const updatedCategory = await prisma.serviceCategory.update({
      where: { id: categoryId },
      data: updateData,
    });

    return NextResponse.json({
      message: 'Category updated successfully',
      category: updatedCategory,
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { message: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Delete a category (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(req);
    
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only admins can delete categories
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Only administrators can delete categories' },
        { status: 403 }
      );
    }

    const categoryId = params.id;

    // Check if category exists
    const existingCategory = await prisma.serviceCategory.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: {
            jobs: true,
          },
        },
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if category has associated jobs
    if (existingCategory._count.jobs > 0) {
      return NextResponse.json(
        { message: 'Cannot delete category with associated jobs' },
        { status: 400 }
      );
    }

    // Delete the category
    await prisma.serviceCategory.delete({
      where: { id: categoryId },
    });

    return NextResponse.json({
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { message: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
