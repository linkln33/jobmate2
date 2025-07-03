import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { getSupabaseClient, getSupabaseServiceClient } from '@/lib/supabase/client';

// GET /api/categories/[id] - Get a specific category by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = params.id;

    const supabase = getSupabaseServiceClient();
    
    // Get the category
    const { data: category, error: categoryError } = await supabase
      .from('serviceCategories')
      .select('*')
      .eq('id', categoryId)
      .single();
      
    if (categoryError) {
      console.error('Error fetching category:', categoryError);
      return NextResponse.json(
        { message: 'Failed to fetch category' },
        { status: 500 }
      );
    }
    
    // Get related jobs
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select(`
        *,
        customer:customerId(*),
        media:id(url, type)
      `)
      .eq('categoryId', categoryId)
      .eq('status', 'OPEN')
      .order('createdAt', { ascending: false })
      .limit(10);
      
    if (jobsError) {
      console.error('Error fetching jobs:', jobsError);
    }
    
    // Get proposal counts for each job
    const jobIds = jobs ? jobs.map((job: any) => job.id) : [];
    let proposalCounts: any[] = [];
    
    if (jobIds.length > 0) {
      const { data: counts, error: proposalError } = await supabase
        .rpc('get_proposal_counts_by_job_ids', { job_ids: jobIds });
        
      if (!proposalError && counts) {
        proposalCounts = counts;
      } else if (proposalError) {
        console.error('Error fetching proposal counts:', proposalError);
      }
    }
      
    // Get total job count for this category
    const { count: jobCount, error: countError } = await supabase
      .from('jobs')
      .select('id', { count: 'exact', head: true })
      .eq('categoryId', categoryId);
      
    // Combine the data
    const categoryWithJobs = {
      ...category,
      jobs: jobs || [],
      _count: {
        jobs: jobCount || 0
      }
    };

    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Enhance jobs with proposal counts
    const enhancedJobs = jobs ? jobs.map((job: any) => {
      const proposalCount = proposalCounts?.find((p: any) => p.job_id === job.id);
      return {
        ...job,
        _count: {
          proposals: proposalCount?.count || 0
        }
      };
    }) : [];
    
    // Create the final response object
    const response = {
      ...category,
      jobs: enhancedJobs,
      _count: {
        jobs: jobCount || 0
      }
    };

    return NextResponse.json(response);
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

    const supabase = getSupabaseServiceClient();
    
    // Check if category exists
    const { data: existingCategory, error: categoryError } = await supabase
      .from('serviceCategories')
      .select('*')
      .eq('id', categoryId)
      .single();

    if (categoryError || !existingCategory) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if name is being changed and if it conflicts with another category
    if (name && name !== existingCategory.name) {
      const { data: nameConflicts, error: nameError } = await supabase
        .from('serviceCategories')
        .select('id')
        .ilike('name', name)
        .neq('id', categoryId);

      if (nameError) {
        console.error('Error checking for name conflicts:', nameError);
        return NextResponse.json(
          { message: 'Failed to check name availability' },
          { status: 500 }
        );
      }

      if (nameConflicts && nameConflicts.length > 0) {
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
    const { data: updatedCategory, error: updateError } = await supabase
      .from('serviceCategories')
      .update(updateData)
      .eq('id', categoryId)
      .select()
      .single();
      
    if (updateError) {
      console.error('Error updating category:', updateError);
      return NextResponse.json(
        { message: 'Failed to update category' },
        { status: 500 }
      );
    }

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

    const supabase = getSupabaseServiceClient();
    
    // Check if category exists
    const { data: existingCategory, error: categoryError } = await supabase
      .from('serviceCategories')
      .select('id')
      .eq('id', categoryId)
      .single();

    if (categoryError || !existingCategory) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if category has associated jobs
    const { count: jobCount, error: countError } = await supabase
      .from('jobs')
      .select('id', { count: 'exact', head: true })
      .eq('categoryId', categoryId);
      
    if (countError) {
      console.error('Error checking for associated jobs:', countError);
      return NextResponse.json(
        { message: 'Failed to check for associated jobs' },
        { status: 500 }
      );
    }

    if (jobCount && jobCount > 0) {
      return NextResponse.json(
        { message: 'Cannot delete category with associated jobs' },
        { status: 400 }
      );
    }

    // Delete the category
    const { error: deleteError } = await supabase
      .from('serviceCategories')
      .delete()
      .eq('id', categoryId);
      
    if (deleteError) {
      console.error('Error deleting category:', deleteError);
      return NextResponse.json(
        { message: 'Failed to delete category' },
        { status: 500 }
      );
    }

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
