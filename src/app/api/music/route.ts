import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET: Fetch all music tracks (with optional sorting/filtering)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sortByDate = searchParams.get("sortByDate") === "true";
    
    const client = await clientPromise;
    const db = client.db();
    
    let query = {};
    let sort: any = { createdAt: -1 }; // Default sort by newest

    if (sortByDate) {
      sort = { date: -1 };
    }

    const tracks = await db
      .collection("tracks")
      .find(query)
      .sort(sort)
      .toArray();

    return NextResponse.json(tracks);
  } catch (error: any) {
    console.error("Music GET error:", error);
    return NextResponse.json({ error: "Failed to fetch music" }, { status: 500 });
  }
}

// POST: Add a new music track
export async function POST(request: Request) {
  try {
    // Basic auth check (could be refined with a helper)
    const token = (await request.headers.get("cookie"))?.split("; ").find(c => c.startsWith("admin-token="))?.split("=")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, artist, audioUrl, coverArt, date, duration } = body;

    if (!title || !audioUrl) {
      return NextResponse.json({ error: "Title and Audio URL are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const newTrack = {
      title,
      artist: artist || "Jace Surreal",
      audioUrl,
      coverArt: coverArt || "/images/default-cover.jpg",
      date: date ? new Date(date) : new Date(), // The important new field
      duration: duration || 0,
      plays: 0,
      likes: 0,
      dislikes: 0,
      createdAt: new Date(),
    };

    const result = await db.collection("tracks").insertOne(newTrack);

    return NextResponse.json({ ...newTrack, _id: result.insertedId }, { status: 201 });
  } catch (error: any) {
    console.error("Music POST error:", error);
    return NextResponse.json({ error: "Failed to create music track" }, { status: 500 });
  }
}
