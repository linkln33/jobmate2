import { BaseService } from './base.service';
import { CategoriesTable, CategoryWithRelations } from '@/lib/supabase/types';

/**
 * Service for managing categories
 */
export class CategoryService extends BaseService {
  /**
   * Get all categories
   * @param includeInactive Whether to include inactive categories
   * @returns List of categories
   */
  async getAllCategories(includeInactive: boolean = false): Promise<CategoriesTable['Row'][]> {
    let query = this.supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (!includeInactive) {
      query = query.eq('is_active', true);
    }
    
    const { data, error } = await query;

    if (error) {
      this.handleError(error, 'Failed to fetch categories');
    }

    return data;
  }

  /**
   * Get a category by ID
   * @param id Category ID
   * @returns Category
   */
  async getCategoryById(id: string): Promise<CategoriesTable['Row']> {
    const { data, error } = await this.supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      this.handleError(error, 'Failed to fetch category');
    }

    return data;
  }

  /**
   * Get a category by slug
   * @param slug Category slug
   * @returns Category
   */
  async getCategoryBySlug(slug: string): Promise<CategoriesTable['Row']> {
    const { data, error } = await this.supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      this.handleError(error, 'Failed to fetch category');
    }

    return data;
  }

  /**
   * Get category hierarchy
   * @returns Nested category structure
   */
  async getCategoryHierarchy(): Promise<CategoryWithRelations[]> {
    // First get all categories
    const { data: allCategories, error } = await this.supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      this.handleError(error, 'Failed to fetch categories');
    }

    // Build hierarchy
    const rootCategories: CategoryWithRelations[] = [];
    const categoryMap = new Map<string, CategoryWithRelations>();
    
    // Initialize with empty children arrays
    allCategories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] });
    });
    
    // Build the tree
    allCategories.forEach(category => {
      const categoryWithRelations = categoryMap.get(category.id)!;
      
      if (category.parent_id) {
        const parent = categoryMap.get(category.parent_id);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(categoryWithRelations);
        }
      } else {
        rootCategories.push(categoryWithRelations);
      }
    });

    return rootCategories;
  }

  /**
   * Create a new category (admin only)
   * @param category Category data
   * @returns Created category
   */
  async createCategory(category: CategoriesTable['Insert']): Promise<CategoriesTable['Row']> {
    await this.requireAdmin();
    
    const { data, error } = await this.supabase
      .from('categories')
      .insert(category)
      .select()
      .single();

    if (error) {
      this.handleError(error, 'Failed to create category');
    }

    return data;
  }

  /**
   * Update a category (admin only)
   * @param id Category ID
   * @param category Category data to update
   * @returns Updated category
   */
  async updateCategory(id: string, category: CategoriesTable['Update']): Promise<CategoriesTable['Row']> {
    await this.requireAdmin();
    
    const { data, error } = await this.supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      this.handleError(error, 'Failed to update category');
    }

    return data;
  }

  /**
   * Delete a category (admin only)
   * @param id Category ID
   * @returns Success status
   */
  async deleteCategory(id: string): Promise<{ success: boolean }> {
    await this.requireAdmin();
    
    const { error } = await this.supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      this.handleError(error, 'Failed to delete category');
    }

    return { success: true };
  }

  /**
   * Get subcategories of a parent category
   * @param parentId Parent category ID
   * @returns List of subcategories
   */
  async getSubcategories(parentId: string): Promise<CategoriesTable['Row'][]> {
    const { data, error } = await this.supabase
      .from('categories')
      .select('*')
      .eq('parent_id', parentId)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      this.handleError(error, 'Failed to fetch subcategories');
    }

    return data;
  }

  /**
   * Check if user is admin and throw error if not
   * @private
   */
  private async requireAdmin(): Promise<void> {
    const isAdmin = await this.isUserAdmin();
    
    if (!isAdmin) {
      this.handleError(
        { status: 403, code: 'FORBIDDEN' }, 
        'You do not have permission to perform this action'
      );
    }
  }
}

// Export a singleton instance for client-side use
export const categoryService = new CategoryService();
