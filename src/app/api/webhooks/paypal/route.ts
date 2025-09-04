import { NextRequest, NextResponse } from "next/server";
import { paypalService } from "@/lib/paypal-service";

export async function POST(request: NextRequest) {
  try {
    // Get webhook headers and body
    const headers = Object.fromEntries(request.headers.entries());
    const body = await request.text();

    // Process PayPal webhook
    const result = await paypalService.processWebhook(headers, body);

    if (result.success) {
      return NextResponse.json({
        success: true,
        processed: result.processed,
      });
    } else {
      console.error("PayPal webhook processing failed:", result.error);
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error("PayPal webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Handle webhook verification (GET request from PayPal)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const challenge = searchParams.get("challenge");
    
    if (challenge) {
      // PayPal webhook verification challenge
      return new NextResponse(challenge, {
        status: 200,
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }

    return NextResponse.json({ status: "PayPal webhook endpoint active" });
    
  } catch (error) {
    console.error("PayPal webhook GET error:", error);
    return NextResponse.json(
      { error: "Webhook verification failed" },
      { status: 500 }
    );
  }
}