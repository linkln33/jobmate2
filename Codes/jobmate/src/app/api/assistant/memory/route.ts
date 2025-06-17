import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { withAIRateLimit } from "../middleware";
import { authOptions } from "@/lib/auth";

// Schema for memory log creation
const memoryLogSchema = z.object({
  action: z.string(),
  mode: z.string(),
  context: z.any().optional(),
  feedbackText: z.string().optional(),
  aiGenerated: z.boolean().optional(),
  metadata: z.record(z.any()).optional(),
});

// Schema for memory log query
const memoryQuerySchema = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
  mode: z.string().optional(),
  interactionType: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

/**
 * GET /api/assistant/memory
 * Retrieves memory logs for the current user with filtering options
 */
export const GET = withAIRateLimit(async function GET(request: NextRequest) {
  try {
    // Get the authenticated user session
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse query parameters
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    const mode = url.searchParams.get("mode") || undefined;
    const interactionType = url.searchParams.get("interactionType") || undefined;
    const startDate = url.searchParams.get("startDate") || undefined;
    const endDate = url.searchParams.get("endDate") || undefined;

    // Validate query parameters
    const validatedQuery = memoryQuerySchema.parse({
      limit,
      offset,
      mode,
      interactionType,
      startDate,
      endDate,
    });

    // Build where clause for filtering
    const where: any = {
      userId: user.id,
    };

    if (validatedQuery.mode) {
      where.mode = validatedQuery.mode;
    }

    if (validatedQuery.interactionType) {
      where.interactionType = validatedQuery.interactionType;
    }

    if (validatedQuery.startDate || validatedQuery.endDate) {
      where.createdAt = {};
      
      if (validatedQuery.startDate) {
        where.createdAt.gte = new Date(validatedQuery.startDate);
      }
      
      if (validatedQuery.endDate) {
        where.createdAt.lte = new Date(validatedQuery.endDate);
      }
    }

    // Query memory logs with pagination and filtering
    const memoryLogs = await prisma.assistantMemoryLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: validatedQuery.limit || 10,
      skip: validatedQuery.offset || 0,
    });

    // Get total count for pagination
    const totalCount = await prisma.assistantMemoryLog.count({ where });

    return NextResponse.json({
      data: memoryLogs,
      pagination: {
        total: totalCount,
        limit: validatedQuery.limit || 10,
        offset: validatedQuery.offset || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching memory logs:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
});

/**
 * POST /api/assistant/memory
 * Creates a new memory log for the current user
 */
export const POST = withAIRateLimit(async function POST(request: NextRequest) {
  try {
    // Get the authenticated user session
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = memoryLogSchema.parse(body);

    // Create memory log
    const memoryLog = await prisma.assistantMemoryLog.create({
      data: {
        userId: user.id,
        mode: validatedData.mode,
        interactionType: validatedData.action,
        context: {
          ...validatedData.context || {},
          feedbackText: validatedData.feedbackText,
          aiGenerated: validatedData.aiGenerated || false
        },
        routePath: body.metadata?.path,
      },
    });

    // Update analytics
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.assistantAnalytics.upsert({
      where: {
        userId_date: {
          userId: user.id,
          date: today,
        },
      },
      update: {
        totalInteractions: { increment: 1 },
      },
      create: {
        userId: user.id,
        date: today,
        totalInteractions: 1,
      },
    });

    return NextResponse.json({ data: memoryLog });
  } catch (error) {
    console.error("Error creating memory log:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
});

/**
 * PUT /api/assistant/memory/:id/feedback
 * Updates a memory log with user feedback
 */
// Fix PUT handler signature to match expected parameters
export const PUT = withAIRateLimit(async function PUT(request: NextRequest) {
  try {
    // Get the authenticated user session
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse request body and extract ID from URL
    const body = await request.json();
    const { feedbackText } = body;
    
    // Get ID from URL path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 2]; // Extract ID from path

    // Find memory log
    const memoryLog = await prisma.assistantMemoryLog.findUnique({
      where: { id },
    });

    if (!memoryLog) {
      return NextResponse.json({ error: "Memory log not found" }, { status: 404 });
    }

    if (memoryLog.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Update memory log with feedback by storing in context
    const updatedMemoryLog = await prisma.assistantMemoryLog.update({
      where: { id },
      data: {
        context: {
          ...(memoryLog.context as object || {}),
          feedbackText
        }
      },
    });

    return NextResponse.json({ data: updatedMemoryLog });
  } catch (error) {
    console.error("Error updating memory log:", error);
    return NextResponse.json(
      { error: "Failed to update memory log" },
      { status: 500 }
    );
  }
});
