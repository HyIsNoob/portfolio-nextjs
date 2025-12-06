import { NextResponse } from "next/server";

const YOUTUBE_CHANNEL_ID = "UCDabE6mnD9G-1xljiTszRoA";

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "YouTube API key not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${YOUTUBE_CHANNEL_ID}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch YouTube data");
    }

    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const subscriberCount = parseInt(
        data.items[0].statistics.subscriberCount,
        10
      );
      return NextResponse.json({ subscriberCount });
    }

    return NextResponse.json(
      { error: "Channel not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("YouTube API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch YouTube statistics" },
      { status: 500 }
    );
  }
}

