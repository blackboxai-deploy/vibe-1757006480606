import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    const projects = await prisma.project.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        videoUrl: true,
        thumbnailUrl: true,
        duration: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      projects,
    });

  } catch (error) {
    console.error("Get projects error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    // Check usage limits
    const currentUsage = user.currentUsage as { videos: number };
    const usageLimits = user.usageLimits as { videos: number };

    if (usageLimits.videos !== -1 && currentUsage.videos >= usageLimits.videos) {
      return NextResponse.json(
        { error: "Video limit reached for this month. Please upgrade your plan." },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const template = formData.get("template") as string;
    const file = formData.get("file") as File | null;

    if (!title) {
      return NextResponse.json(
        { error: "Project title is required" },
        { status: 400 }
      );
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        userId: user.id,
        title,
        description: description || null,
        status: "draft",
        settings: {
          template: template || null,
          ...(file && {
            originalFileName: file.name,
            originalFileSize: file.size,
            originalFileType: file.type,
          }),
        },
      },
    });

    // If file was uploaded, process it
    if (file) {
      // TODO: Upload file to cloud storage
      // TODO: Extract content using AI
      // TODO: Generate video blueprint
      
      // For now, simulate file processing
      await prisma.project.update({
        where: { id: project.id },
        data: {
          status: "processing",
          fileUrl: `https://storage.animagenius.com/uploads/${project.id}/${file.name}`,
          fileName: file.name,
          fileType: file.type,
          fileSize: BigInt(file.size),
        },
      });

      // Start AI processing job
      await prisma.aiProcessingJob.create({
        data: {
          projectId: project.id,
          type: "extract_content",
          status: "pending",
          input: {
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
          },
          provider: "openai",
        },
      });
    }

    // Update user usage
    await prisma.user.update({
      where: { id: user.id },
      data: {
        currentUsage: {
          ...currentUsage,
          videos: currentUsage.videos + 1,
        },
      },
    });

    // Track analytics
    await prisma.usageAnalytic.create({
      data: {
        userId: user.id,
        action: "project_created",
        metadata: {
          projectId: project.id,
          template: template || null,
          hasFile: !!file,
        },
      },
    });

    return NextResponse.json({
      success: true,
      projectId: project.id,
      message: "Project created successfully",
    });

  } catch (error) {
    console.error("Create project error:", error);
    
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}