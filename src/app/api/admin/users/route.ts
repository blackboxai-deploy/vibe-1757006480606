import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import { requireAdminAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await requireAdminAuth(request);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    // Build where clause for search
    const where = search 
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    // Fetch users with pagination
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          subscriptionTier: true,
          subscriptionStatus: true,
          createdAt: true,
          lastLoginAt: true,
          currentUsage: true,
          usageLimits: true,
          _count: {
            select: {
              projects: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      
      prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasMore: page < totalPages,
      },
    });

  } catch (error) {
    console.error("Admin users error:", error);
    
    if (error instanceof Error && error.message.includes("Admin")) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// Update user endpoint
export async function PUT(request: NextRequest) {
  try {
    await requireAdminAuth(request);

    const body = await request.json();
    const { userId, updates } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...updates,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        usageLimits: true,
        currentUsage: true,
      },
    });

    // Log admin action
    await prisma.adminAuditLog.create({
      data: {
        adminUserId: "admin", // TODO: Get actual admin user ID
        action: "user_updated",
        targetType: "user",
        targetId: userId,
        metadata: {
          updates,
          timestamp: new Date(),
        },
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: "User updated successfully",
    });

  } catch (error) {
    console.error("Update user error:", error);
    
    if (error instanceof Error && error.message.includes("Admin")) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}