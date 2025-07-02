import { PrismaClient, Prisma, JobStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';

/**
 * Service for managing listings using Prisma
 * This is a refactored version of ListingService that uses Prisma instead of Supabase for data operations
 */
export class ListingPrismaService {
  /**
   * Get a listing by ID
   * @param id Listing ID
   * @returns Listing with details
   */
  async getListingById(id: string) {
    try {
      // Increment view count
      await this.incrementViewCount(id);

      const listing = await prisma.job.findUnique({
        where: { id },
        include: {
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImageUrl: true
            }
          },
          specialist: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImageUrl: true
            }
          },
          serviceCategory: {
            select: {
              id: true,
              name: true
            }
          },
          media: true
        }
      });

      if (!listing) {
        throw new Error('Listing not found');
      }

      return listing;
    } catch (error) {
      console.error('Failed to fetch listing:', error);
      throw error;
    }
  }

  /**
   * Create a new listing
   * @param userId User ID
   * @param listing Listing data
   * @returns Created listing
   */
  async createListing(
    userId: string,
    listing: {
      title: string;
      description: string;
      categoryId: string;
      budgetMin?: number;
      budgetMax?: number;
      budgetType?: string;
      location?: string;
      latitude?: number;
      longitude?: number;
      attachments?: Array<{ file_type: string; file_path: string; }>;
    }) {
    try {
      // Check if user can create a listing
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          _count: {
            select: {
              jobsAsCustomer: true
            }
          }
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Check if user has reached the job limit
      // For simplicity, we'll set a fixed limit of 100 jobs per user
      // In a real implementation, this would be based on subscription plan
      const jobCount = user._count.jobsAsCustomer;
      const jobLimit = 100;

      if (jobCount >= jobLimit) {
        throw new Error(`You have reached the maximum number of jobs (${jobLimit})`);
      }

      // Create listing in a transaction
      return await prisma.$transaction(async (tx) => {
        // Create the listing
        const newListing = await tx.job.create({
          data: {
            title: listing.title,
            description: listing.description,
            customerId: userId,
            serviceCategoryId: listing.categoryId,
            budgetMin: listing.budgetMin,
            budgetMax: listing.budgetMax,
            // budgetType field doesn't exist in Prisma schema
            address: listing.location,
            latitude: listing.latitude,
            longitude: 0,
            city: '',
            state: '',
            zipCode: '',
            country: 'US',
            isRemote: false,
            status: JobStatus.DRAFT
          }
        });

        // Add media if provided
        if (listing.attachments && listing.attachments.length > 0) {
          await Promise.all(
            listing.attachments.map(attachment =>
              tx.jobMedia.create({
                data: {
                  jobId: newListing.id,
                  mediaType: attachment.file_type || 'image',
                  mediaUrl: attachment.file_path
                }
              })
            )
          );
        }

        // Return the created listing with included relations
        return await tx.job.findUnique({
          where: { id: newListing.id },
          include: {
            customer: true,
            serviceCategory: true,
            media: true
          }
        });
      });
    } catch (error) {
      console.error('Failed to create listing:', error);
      throw error;
    }
  }

  /**
   * Update a listing
   * @param id Listing ID
   * @param listing Listing data to update
   * @returns Updated listing
   */
  async updateListing(id: string, listing: {
    title?: string;
    description?: string;
    category_id?: string;
    budget_min?: string | number;
    budget_max?: string | number;
    location?: string;
    location_lat?: string | number;
    location_lng?: string | number;
    status?: string;
    attachments?: Array<{ file_type: string; file_path: string; }>;
  }) {
    try {
      // Verify ownership
      const existingListing = await prisma.job.findUnique({
        where: { id },
        select: { customerId: true }
      });

      if (!existingListing) {
        throw new Error('Listing not found');
      }

      const userId = await this.getCurrentUserId();

      if (existingListing.customerId !== userId) {
        throw new Error('You do not have permission to update this listing');
      }

      // Update listing in a transaction
      return await prisma.$transaction(async (tx) => {
        // Update the listing
        const updatedListing = await tx.job.update({
          where: { id },
          data: {
            ...(listing.title && { title: listing.title }),
            ...(listing.description && { description: listing.description }),
            ...(listing.category_id && { serviceCategoryId: listing.category_id }),
            ...(listing.budget_min && { budgetMin: parseFloat(listing.budget_min) }),
            ...(listing.budget_max && { budgetMax: parseFloat(listing.budget_max) }),
            ...(listing.location && { address: listing.location }),
            ...(listing.location_lat && { latitude: parseFloat(listing.location_lat) }),
            ...(listing.location_lng && { longitude: parseFloat(listing.location_lng) }),
            ...(listing.status && { status: this.mapStatusToJobStatus(listing.status) })
          }
        });

        // Update media if provided
        if (listing.attachments && listing.attachments.length > 0) {
          // Delete existing media
          await tx.jobMedia.deleteMany({
            where: { jobId: id }
          });

          // Add new media
          await Promise.all(
            listing.attachments.map(attachment =>
              tx.jobMedia.create({
                data: {
                  jobId: id,
                  mediaType: attachment.file_type || 'image',
                  mediaUrl: attachment.file_path
                }
              })
            )
          );
        }

        // Return the updated listing with included relations
        return await tx.job.findUnique({
          where: { id },
          include: {
            customer: true,
            specialist: true,
            serviceCategory: true,
            media: true
          }
        });
      });
    } catch (error) {
      console.error('Failed to update listing:', error);
      throw error;
    }
  }

  /**
   * Delete a listing
   * @param id Listing ID
   * @param userId User ID for permission check
   */
  async deleteListing(id: string, userId: string): Promise<void> {
    try {
      // Check if listing exists and belongs to user
      const listing = await prisma.job.findUnique({
        where: { id },
        select: {
          id: true,
          customerId: true,
          status: true
        }
      });

      if (!listing) {
        throw new Error('Listing not found');
      }

      if (listing.customerId !== userId) {
        throw new Error('You do not have permission to delete this listing');
      }

      // Delete listing and related data in a transaction
      await prisma.$transaction(async (tx) => {
        // Delete media
        await tx.jobMedia.deleteMany({
          where: { jobId: id }
        });
        
        // Delete bookmarks if they exist in the schema
        try {
          await tx.bookmark.deleteMany({
            where: { jobId: id }
          });
        } catch (e) {
          // If bookmark model doesn't exist in the transaction, ignore the error
          console.log('Bookmark model not available in transaction, skipping');
        }

        // Delete listing
        await tx.job.delete({
          where: { id }
        });
      });
    } catch (error) {
      console.error('Failed to delete listing:', error);
      throw error;
    }
  }

  /**
   * Search listings with filters
   * @param filters Search filters
   * @param page Page number
   * @param limit Items per page
   * @returns Listings matching filters with pagination
   */
  async searchListings(
    filters: {
      query?: string;
      categoryId?: string;
      minBudget?: number;
      maxBudget?: number;
      budgetType?: string;
      location?: string;
      isRemote?: boolean;
      tags?: string[];
      status?: string;
      userId?: string;
      sortBy?: string;
      sortOrder?: string;
    },
    page: number = 1,
    limit: number = 10
  ) {
    try {
      const skip = (page - 1) * limit;

      // Build where conditions
      const where: Prisma.JobWhereInput = {
        status: filters.status ? filters.status as JobStatus : JobStatus.OPEN,
        ...(filters.query && {
          OR: [
            { title: { contains: filters.query, mode: 'insensitive' } },
            { description: { contains: filters.query, mode: 'insensitive' } }
          ]
        }),
        ...(filters.categoryId && { serviceCategoryId: filters.categoryId }),
        ...(filters.location && { location: { contains: filters.location, mode: 'insensitive' } }),
        ...(filters.isRemote !== undefined && { isRemote: filters.isRemote }),
        ...(filters.minBudget !== undefined && { budgetMin: { gte: filters.minBudget } }),
        ...(filters.maxBudget !== undefined && { budgetMax: { lte: filters.maxBudget } }),
        ...(filters.budgetType && { budgetType: filters.budgetType }),
        // Note: tags relation doesn't exist in the Job model
        // We could search in aiGeneratedTags JSON field instead if needed
      };

      // Get total count
      const total = await prisma.job.count({ where });

      // Get listings with pagination
      const listings = await prisma.job.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImageUrl: true
            }
          },
          serviceCategory: true,
          media: true,
          _count: {
            select: {
              bookmarks: true,
              media: true
            }
          }
        },
        orderBy: {
          ...(filters.sortBy === 'date' && { createdAt: (filters.sortOrder === 'asc' ? 'asc' : 'desc') as Prisma.SortOrder }),
          ...(filters.sortBy === 'budget' && { budgetMax: (filters.sortOrder === 'asc' ? 'asc' : 'desc') as Prisma.SortOrder })
        },
        skip,
        take: limit
      });

      return {
        listings,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Failed to search listings:', error);
      throw error;
    }
  }

  /**
   * Get listings by user ID
   * @param userId User ID
   * @param status Optional status filter
   * @param page Page number
   * @param limit Items per page
   * @returns User's listings with pagination
   */
  async getListingsByUser(
    userId: string,
    status?: string,
    page: number = 1,
    limit: number = 10
  ) {
    try {
      const skip = (page - 1) * limit;

      // Build where conditions
      const where: Prisma.JobWhereInput = {
        customerId: userId,
        ...(status && { status: this.mapStatusToJobStatus(status) })
      };

      // Get total count
      const total = await prisma.job.count({ where });

      // Get listings
      const listings = await prisma.job.findMany({
        where,
        include: {
          serviceCategory: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          // tags relation doesn't exist in Prisma schema
          _count: {
            select: {
              bookmarks: true,
              media: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      });

      return {
        listings,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Failed to get user listings:', error);
      throw error;
    }
  }

  /**
   * Get featured listings
   * @param limit Maximum number of listings to return
   * @returns Featured listings
   */
  async getFeaturedListings(limit: number = 5) {
    try {
      return await prisma.job.findMany({
        where: {
          status: JobStatus.OPEN,
          // Note: isFeatured doesn't exist in the Job model, using a different criteria
          // For example, jobs with high budget
          budgetMin: {
            gte: 1000
          }
        },
        include: {
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImageUrl: true
            }
          },
          serviceCategory: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: limit
      });
    } catch (error) {
      console.error('Failed to get featured listings:', error);
      throw error;
    }
  }

  /**
   * Get recent listings
   * @param limit Maximum number of listings to return
   * @returns Recent listings
   */
  async getRecentListings(limit: number = 10) {
    try {
      return await prisma.job.findMany({
        where: {
          status: JobStatus.OPEN
        },
        include: {
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImageUrl: true
            }
          },
          serviceCategory: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: limit
      });
    } catch (error) {
      console.error('Failed to get recent listings:', error);
      throw error;
    }
  }

  /**
   * Increment view count for a listing
   * @param id Listing ID
   */
  private async incrementViewCount(id: string): Promise<void> {
    try {
      // Note: Job model doesn't have viewCount field, so we're skipping this
      // In a real implementation, you might track views in a separate table
      return;
    } catch (error) {
      // Silently fail as this is not critical
      console.error('Failed to increment view count:', error);
    }
  }

  /**
   * Check if a user is an admin
   * @param userId User ID
   * @returns Boolean indicating if user is admin
   */
  private async isUserAdmin(userId: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
      });

      return user?.role === 'ADMIN';
    } catch (error) {
      console.error('Failed to check user role:', error);
      return false;
    }
  }

  /**
   * Check if a status transition is valid
   * @param currentStatus Current listing status
   * @param newStatus New listing status
   * @returns Boolean indicating if transition is valid
   */
  private isValidStatusTransition(currentStatus: JobStatus, newStatus: JobStatus): boolean {
    // Define valid transitions
    // Map the status values to the actual JobStatus enum values from Prisma
    const validTransitions: Record<JobStatus, JobStatus[]> = {
      [JobStatus.DRAFT]: [JobStatus.OPEN, JobStatus.DRAFT],
      [JobStatus.OPEN]: [JobStatus.COMPLETED, JobStatus.CANCELLED, JobStatus.ASSIGNED],
      [JobStatus.ASSIGNED]: [JobStatus.IN_PROGRESS, JobStatus.CANCELLED],
      [JobStatus.IN_PROGRESS]: [JobStatus.COMPLETED, JobStatus.CANCELLED, JobStatus.DISPUTED],
      [JobStatus.COMPLETED]: [],
      [JobStatus.CANCELLED]: [JobStatus.DRAFT],
      [JobStatus.DISPUTED]: [JobStatus.COMPLETED, JobStatus.CANCELLED]
    };

    // Check if transition is valid
    return validTransitions[currentStatus]?.includes(newStatus) || false;
  }
}

// Export a singleton instance
export const listingPrismaService = new ListingPrismaService();
