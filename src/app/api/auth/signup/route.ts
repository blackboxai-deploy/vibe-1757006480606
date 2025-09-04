import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/database";
import { generateJWT } from "@/lib/auth";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  plan: z.enum(["FREE", "STARTER", "PRO", "ENTERPRISE"]).default("FREE"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = signupSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcryptjs.hash(validatedData.password, 12);

    // Set usage limits based on plan
    const usageLimits = {
      FREE: { videos: 5, duration: 120, fileSize: 100 },
      STARTER: { videos: 25, duration: 600, fileSize: 500 },
      PRO: { videos: 100, duration: 1800, fileSize: 2048 },
      ENTERPRISE: { videos: -1, duration: -1, fileSize: 10240 },
    };

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        passwordHash,
        subscriptionTier: validatedData.plan,
        usageLimits: usageLimits[validatedData.plan],
        currentUsage: { videos: 0, duration: 0, fileSize: 0 },
        trialEndsAt: validatedData.plan !== "FREE" 
          ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days trial
          : null,
      },
    });

    // Generate JWT token
    const token = await generateJWT(user.id);

    // Track signup analytics
    await prisma.usageAnalytic.create({
      data: {
        userId: user.id,
        action: "user_signup",
        metadata: {
          plan: validatedData.plan,
          timestamp: new Date(),
        },
      },
    });

    // Create welcome notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "success",
        title: "Welcome to AnimaGenius!",
        message: `Your ${validatedData.plan} account has been created successfully. ${
          validatedData.plan !== "FREE" ? "Your 7-day trial starts now." : ""
        }`,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        subscriptionTier: user.subscriptionTier,
        usageLimits: user.usageLimits,
      },
      token,
    });

  } catch (error) {
    console.error("Signup error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}