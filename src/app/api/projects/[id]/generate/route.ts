import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import { requireAuth } from "@/lib/auth";
import { aiService } from "@/lib/ai-services";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(request);
    const projectId = params.id;

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: user.id,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    if (project.status === "processing" || project.status === "rendering") {
      return NextResponse.json(
        { error: "Project is already being processed" },
        { status: 400 }
      );
    }

    // Update project status
    await prisma.project.update({
      where: { id: projectId },
      data: { status: "processing" },
    });

    // Start AI processing
    const body = await request.json();
    const { preferences = {} } = body;

    try {
      // Step 1: Extract content if file exists
      let contentExtraction = null;
      if (project.fileUrl) {
        // Simulate content extraction
        contentExtraction = {
          text: "Sample extracted content from document",
          headings: ["Introduction", "Main Content", "Conclusion"],
          keyPoints: ["Key point 1", "Key point 2", "Key point 3"],
          images: [],
          metadata: {
            wordCount: 500,
            language: "en",
          },
        };
      }

      // Step 2: Generate video blueprint
      const blueprint = contentExtraction 
        ? await aiService.generateVideoBlueprint(contentExtraction, preferences)
        : {
            title: project.title,
            scenes: [
              {
                duration: 30,
                description: "Introduction scene with project title",
                visualElements: ["title text", "background"],
                transitions: "fade in",
              },
            ],
            totalDuration: 30,
            style: preferences.style || "professional",
            voiceOver: {
              script: project.description || "Welcome to this video presentation",
              tone: "professional",
              pacing: "medium",
            },
          };

      // Update project with blueprint
      await prisma.project.update({
        where: { id: projectId },
        data: {
          aiBlueprint: blueprint,
          script: blueprint.voiceOver,
          status: "rendering",
        },
      });

      // Step 3: Generate video
      const videoResult = await aiService.generateVideo(blueprint, projectId);

      if (videoResult.success && videoResult.videoUrl) {
        // Update project with video URL
        await prisma.project.update({
          where: { id: projectId },
          data: {
            status: "completed",
            videoUrl: videoResult.videoUrl,
            thumbnailUrl: `${videoResult.videoUrl.replace('.mp4', '_thumb.jpg')}`,
            duration: blueprint.totalDuration,
          },
        });

        // Track completion analytics
        await prisma.usageAnalytic.create({
          data: {
            userId: user.id,
            action: "video_generated",
            metadata: {
              projectId,
              duration: blueprint.totalDuration,
              provider: "synthesia", // or detected provider
            },
          },
        });

        return NextResponse.json({
          success: true,
          project: {
            id: projectId,
            status: "completed",
            videoUrl: videoResult.videoUrl,
            duration: blueprint.totalDuration,
          },
        });
      } else {
        // Update project with error status
        await prisma.project.update({
          where: { id: projectId },
          data: {
            status: "failed",
            processingLogs: {
              error: videoResult.error,
              timestamp: new Date(),
            },
          },
        });

        return NextResponse.json(
          { error: videoResult.error || "Video generation failed" },
          { status: 500 }
        );
      }

    } catch (processingError) {
      // Update project with error status
      await prisma.project.update({
        where: { id: projectId },
        data: {
          status: "failed",
          processingLogs: {
            error: processingError instanceof Error ? processingError.message : "Processing failed",
            timestamp: new Date(),
          },
        },
      });

      throw processingError;
    }

  } catch (error) {
    console.error("Video generation error:", error);
    
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Video generation failed" },
      { status: 500 }
    );
  }
}