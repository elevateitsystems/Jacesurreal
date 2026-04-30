import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db();

    const track = await db.collection("tracks").findOne(
      { _id: new ObjectId(id) },
      { projection: { audioUrl: 1 } }
    );

    if (!track || !track.audioUrl) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (!track.audioUrl.startsWith("data:")) {
      // Only redirect if it's an absolute URL
      if (track.audioUrl.startsWith("http://") || track.audioUrl.startsWith("https://")) {
        return NextResponse.redirect(track.audioUrl);
      }
      // Relative or invalid URL — cannot serve
      return new NextResponse("Invalid audio source", { status: 404 });
    }

    // Example base64 format: data:audio/mpeg;base64,SUQz...
    const matches = track.audioUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return new NextResponse("Invalid audio data", { status: 500 });
    }

    const contentType = matches[1];
    const buffer = Buffer.from(matches[2], "base64");

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Accept-Ranges": "bytes",
      },
    });
  } catch (error: any) {
    console.error("Audio streaming error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
