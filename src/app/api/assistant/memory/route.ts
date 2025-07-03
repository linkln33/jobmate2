import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getSupabaseClient, getSupabaseServiceClient } from "@/lib/supabase/client";
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
    const supabase = getSupabaseServiceClient();
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', session.user.email)
      .single();

    if (userError || !user) {
      console.error('Error fetching user:', userError);
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

    // Build query for filtering
    let query = supabase
      .from('assistantMemoryLogs')
      .select('*')
      .eq('userId', user.id)
      .order('createdAt', { ascending: false })
      .range(offset, offset + limit - 1);

    if (validatedQuery.mode) {
      query = query.eq('mode', validatedQuery.mode);
    }

    if (validatedQuery.interactionType) {
      query = query.eq('interactionType', validatedQuery.interactionType);
    }

    if (validatedQuery.startDate) {
      query = query.gte('createdAt', new Date(validatedQuery.startDate).toISOString());
    }

    if (validatedQuery.endDate) {
      query = query.lte('createdAt', new Date(validatedQuery.endDate).toISOString());
    }

    // Execute query
    const { data: memoryLogs, error: logsError } = await query;

    if (logsError) {
      console.error('Error fetching memory logs:', logsError);
      return NextResponse.json({ error: "Failed to fetch memory logs" }, { status: 500 });
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('assistantMemoryLogs')
      .select('*', { count: 'exact', head: true })
      .eq('userId', user.id);

    if (validatedQuery.mode) {
      countQuery = countQuery.eq('mode', validatedQuery.mode);
    }

    if (validatedQuery.interactionType) {
      countQuery = countQuery.eq('interactionType', validatedQuery.interactionType);
    }

    if (validatedQuery.startDate) {
      countQuery = countQuery.gte('createdAt', new Date(validatedQuery.startDate).toISOString());
    }

    if (validatedQuery.endDate) {
      countQuery = countQuery.lte('createdAt', new Date(validatedQuery.endDate).toISOString());
    }

    const { count: totalCount, error: countError } = await countQuery;

    if (countError) {
      console.error('Error counting memory logs:', countError);
      return NextResponse.json({ error: "Failed to count memory logs" }, { status: 500 });
    }

    return NextResponse.json({
      data: memoryLogs || [],
      pagination: {
        total: totalCount || 0,
        limit: validatedQuery.limit || 10,
        offset: validatedQuery.offset || 0,
      },
    });
  } catch (error) {
    console.error("Error retrieving memory logs:", error);
    return NextResponse.json({ error: "Failed to retrieve memory logs" }, { status: 500 });
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
    const supabase = getSupabaseServiceClient();
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', session.user.email)
      .single();

    if (userError || !user) {
      console.error('Error fetching user:', userError);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse request body
    const body = await request.json();
    const validatedData = memoryLogSchema.parse(body);

    // Create memory log
    const memoryLogData = {
      userId: user.id,
      mode: validatedData.mode,
      interactionType: validatedData.action,
      context: validatedData.context,
      feedbackText: validatedData.feedbackText,
      aiGenerated: validatedData.aiGenerated || false,
      metadata: validatedData.metadata || {},
    };

    const { data: memoryLog, error: createError } = await supabase
      .from('assistantMemoryLogs')
      .insert(memoryLogData)
      .select()
      .single();

    if (createError) {
      console.error('Error creating memory log:', createError);
      return NextResponse.json({ error: "Failed to create memory log" }, { status: 500 });
    }

    // Update analytics (upsert)
    const { error: analyticsError } = await supabase
      .from('assistantAnalytics')
      .upsert({
        userId: user.id,
        date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
        interactionType: validatedData.action,
        count: 1 // Will be incremented by Supabase trigger/function
      }, {
        onConflict: 'userId,date,interactionType'
      });

    if (analyticsError) {
      console.error('Error updating analytics:', analyticsError);
      // Continue despite analytics error
    }

    return NextResponse.json({ data: memoryLog });
  } catch (error) {
    console.error("Error creating memory log:", error);
    return NextResponse.json({ error: "Failed to create memory log" }, { status: 500 });
  }
});

/**
 * PATCH /api/assistant/memory/:id
 * Updates an existing memory log
 */
export const PATCH = withAIRateLimit(async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the authenticated user session
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user by email
    const supabase = getSupabaseServiceClient();
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', session.user.email)
      .single();

    if (userError || !user) {
      console.error('Error fetching user:', userError);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get memory log ID from URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const memoryLogId = pathParts[pathParts.length - 1];

    // Check if memory log exists and belongs to user
    const { data: memoryLog, error: fetchError } = await supabase
      .from('assistantMemoryLogs')
      .select('*')
      .eq('id', memoryLogId)
      .eq('userId', user.id)
      .single();

    if (fetchError || !memoryLog) {
      console.error('Error fetching memory log:', fetchError);
      return NextResponse.json({ error: "Memory log not found" }, { status: 404 });
    }

    // Parse request body
    const body = await request.json();
    
    // Update memory log
    const { data: updatedMemoryLog, error: updateError } = await supabase
      .from('assistantMemoryLogs')
      .update({
        ...body,
        updatedAt: new Date().toISOString()
      })
      .eq('id', memoryLogId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating memory log:', updateError);
      return NextResponse.json({ error: "Failed to update memory log" }, { status: 500 });
    }

    return NextResponse.json({ data: updatedMemoryLog });
  } catch (error) {
    console.error("Error updating memory log:", error);
    return NextResponse.json({ error: "Failed to update memory log" }, { status: 500 });
  }
});
