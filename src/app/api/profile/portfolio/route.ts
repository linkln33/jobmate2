import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { getSupabaseServiceClient } from '@/lib/supabase/client';

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
    
    const supabase = getSupabaseServiceClient();
    
    // Get portfolio items with related category data
    const { data: portfolioItems, error } = await supabase
      .from('portfolioItems')
      .select(`
        id,
        userId,
        title,
        description,
        url,
        imageUrl,
        categoryId,
        displayOrder,
        isVisible,
        createdAt,
        updatedAt,
        serviceCategories:categoryId (
          id,
          name,
          slug,
          icon
        )
      `)
      .eq('userId', user.id)
      .order('displayOrder', { ascending: true });
    
    if (error) {
      console.error('Error fetching portfolio items:', error);
      return NextResponse.json(
        { message: 'Failed to fetch portfolio items' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ portfolioItems: portfolioItems || [] });
  } catch (error) {
    console.error('Error in GET /api/profile/portfolio:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
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
    
    const body = await req.json();
    const { title, description, url, imageUrl, categoryId } = body;
    
    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { message: 'Title and description are required' },
        { status: 400 }
      );
    }
    
    const supabase = getSupabaseServiceClient();
    
    // Get current highest display order
    const { data: maxOrderItem, error: orderError } = await supabase
      .from('portfolioItems')
      .select('displayOrder')
      .eq('userId', user.id)
      .order('displayOrder', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (orderError) {
      console.error('Error getting max display order:', orderError);
      // Continue despite error
    }
    
    const nextDisplayOrder = maxOrderItem ? (maxOrderItem.displayOrder + 1) : 1;
    
    // Create portfolio item
    const { data: portfolioItem, error: createError } = await supabase
      .from('portfolioItems')
      .insert({
        userId: user.id,
        title,
        description,
        url: url || null,
        imageUrl: imageUrl || null,
        categoryId: categoryId || null,
        displayOrder: nextDisplayOrder,
        isVisible: true
      })
      .select(`
        id,
        userId,
        title,
        description,
        url,
        imageUrl,
        categoryId,
        displayOrder,
        isVisible,
        createdAt,
        updatedAt,
        serviceCategories:categoryId (
          id,
          name,
          slug,
          icon
        )
      `)
      .single();
    
    if (createError || !portfolioItem) {
      console.error('Error creating portfolio item:', createError);
      return NextResponse.json(
        { message: 'Failed to create portfolio item' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ portfolioItem }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/profile/portfolio:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
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
    
    const body = await req.json();
    const { portfolioItems } = body;
    
    if (!Array.isArray(portfolioItems)) {
      return NextResponse.json(
        { message: 'Invalid request format' },
        { status: 400 }
      );
    }
    
    const supabase = getSupabaseServiceClient();
    const updatedItems = [];
    
    // Process each portfolio item update
    for (const item of portfolioItems) {
      const { id, title, description, url, imageUrl, categoryId, displayOrder, isVisible } = item;
      
      if (!id) {
        continue; // Skip items without ID
      }
      
      // Verify the item belongs to the user
      const { data: existingItem, error: checkError } = await supabase
        .from('portfolioItems')
        .select('id')
        .eq('id', id)
        .eq('userId', user.id)
        .maybeSingle();
      
      if (checkError || !existingItem) {
        console.error(`Error verifying portfolio item ${id}:`, checkError);
        continue; // Skip this item
      }
      
      // Update the item
      const updateData: any = {};
      
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (url !== undefined) updateData.url = url;
      if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
      if (categoryId !== undefined) updateData.categoryId = categoryId;
      if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
      if (isVisible !== undefined) updateData.isVisible = isVisible;
      updateData.updatedAt = new Date().toISOString();
      
      const { data: updatedItem, error: updateError } = await supabase
        .from('portfolioItems')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (updateError || !updatedItem) {
        console.error(`Error updating portfolio item ${id}:`, updateError);
        continue; // Skip this item
      }
      
      updatedItems.push(updatedItem);
    }
    
    // Get all portfolio items after updates
    const { data: allItems, error: fetchError } = await supabase
      .from('portfolioItems')
      .select(`
        id,
        userId,
        title,
        description,
        url,
        imageUrl,
        categoryId,
        displayOrder,
        isVisible,
        createdAt,
        updatedAt,
        serviceCategories:categoryId (
          id,
          name,
          slug,
          icon
        )
      `)
      .eq('userId', user.id)
      .order('displayOrder', { ascending: true });
    
    if (fetchError) {
      console.error('Error fetching updated portfolio items:', fetchError);
      return NextResponse.json({
        message: 'Items updated but failed to fetch all items',
        updatedCount: updatedItems.length
      }, { status: 207 });
    }
    
    return NextResponse.json({
      portfolioItems: allItems || [],
      updatedCount: updatedItems.length
    });
  } catch (error) {
    console.error('Error in PUT /api/profile/portfolio:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
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
    const itemId = searchParams.get('id');
    
    if (!itemId) {
      return NextResponse.json(
        { message: 'Portfolio item ID is required' },
        { status: 400 }
      );
    }
    
    const supabase = getSupabaseServiceClient();
    
    // Verify the item belongs to the user
    const { data: existingItem, error: checkError } = await supabase
      .from('portfolioItems')
      .select('id, displayOrder')
      .eq('id', itemId)
      .eq('userId', user.id)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error verifying portfolio item:', checkError);
      return NextResponse.json(
        { message: 'Failed to verify portfolio item' },
        { status: 500 }
      );
    }
    
    if (!existingItem) {
      return NextResponse.json(
        { message: 'Portfolio item not found or does not belong to user' },
        { status: 404 }
      );
    }
    
    // Delete the item
    const { error: deleteError } = await supabase
      .from('portfolioItems')
      .delete()
      .eq('id', itemId);
    
    if (deleteError) {
      console.error('Error deleting portfolio item:', deleteError);
      return NextResponse.json(
        { message: 'Failed to delete portfolio item' },
        { status: 500 }
      );
    }
    
    // Reorder remaining items to close the gap
    const { data: remainingItems, error: fetchError } = await supabase
      .from('portfolioItems')
      .select('id, displayOrder')
      .eq('userId', user.id)
      .order('displayOrder', { ascending: true });
    
    if (!fetchError && remainingItems) {
      // Update display orders to be sequential
      for (let i = 0; i < remainingItems.length; i++) {
        const { error: updateError } = await supabase
          .from('portfolioItems')
          .update({ displayOrder: i + 1 })
          .eq('id', remainingItems[i].id);
        
        if (updateError) {
          console.error(`Error updating order for item ${remainingItems[i].id}:`, updateError);
          // Continue despite error
        }
      }
    }
    
    return NextResponse.json({
      message: 'Portfolio item deleted successfully',
      deletedId: itemId
    });
  } catch (error) {
    console.error('Error in DELETE /api/profile/portfolio:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
