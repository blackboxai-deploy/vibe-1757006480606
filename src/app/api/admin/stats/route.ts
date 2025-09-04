import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import { requireAdminAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await requireAdminAuth(request);

    // Get current date ranges
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Fetch statistics
    const [
      totalUsers,
      totalUsersLastMonth,
      activeSubscriptions,
      totalProjects,
      monthlyRevenue,
      systemHealth,
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Users from last month for comparison
      prisma.user.count({
        where: {
          createdAt: {
            gte: lastMonth,
            lte: lastDayOfLastMonth,
          },
        },
      }),

      // Active subscriptions
      prisma.subscription.count({
        where: {
          status: "active",
        },
      }),

      // Total projects
      prisma.project.count(),

      // Monthly revenue (simulate)
      prisma.payment.aggregate({
        where: {
          status: "completed",
          paymentDate: {
            gte: firstDayOfMonth,
          },
        },
        _sum: {
          amount: true,
        },
      }),

      // System health (simulate)
      Promise.resolve({
        database: "healthy" as const,
        redis: "healthy" as const,
        aiServices: "healthy" as const,
      }),
    ]);

    // Calculate growth percentages
    const userGrowth = totalUsersLastMonth > 0 
      ? Math.round(((totalUsers - totalUsersLastMonth) / totalUsersLastMonth) * 100)
      : 0;

    return NextResponse.json({
      totalUsers,
      activeSubscriptions,
      totalProjects,
      monthlyRevenue: Number(monthlyRevenue._sum.amount || 0),
      userGrowth,
      systemHealth,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Admin stats error:", error);
    
    if (error instanceof Error && error.message.includes("Admin")) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch admin statistics" },
      { status: 500 }
    );
  }
}