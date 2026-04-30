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
      { projection: { coverArt: 1 } }
    );

    if (!track || !track.coverArt) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (!track.coverArt.startsWith("data:")) {
      if (track.coverArt.startsWith("http://") || track.coverArt.startsWith("https://")) {
        return NextResponse.redirect(track.coverArt);
      }
      return new NextResponse("Invalid image source", { status: 404 });
    }

    // Example base64 format: data:image/jpeg;base64,/9j/4AAQ...
    const matches = track.coverArt.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return new NextResponse("Invalid image data", { status: 500 });
    }

    const contentType = matches[1];
    const buffer = Buffer.from(matches[2], "base64");

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error: any) {
    console.error("Cover art streaming error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
