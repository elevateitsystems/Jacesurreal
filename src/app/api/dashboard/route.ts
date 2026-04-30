import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    // 1. Total songs count
    const totalSongs = await db.collection("tracks").countDocuments();

    // 2. Aggregate totals (plays, likes, dislikes)
    const [totals] = await db.collection("tracks").aggregate([
      {
        $group: {
          _id: null,
          totalPlays: { $sum: "$plays" },
          totalLikes: { $sum: "$likes" },
          totalDislikes: { $sum: "$dislikes" },
        },
      },
    ]).toArray();

    const totalPlays = totals?.totalPlays || 0;
    const totalReacts = (totals?.totalLikes || 0) + (totals?.totalDislikes || 0);

    // 3. Top 5 by plays
    const topByPlays = await db.collection("tracks")
      .find({}, { projection: { audioUrl: 0, coverArt: 0 } })
      .sort({ plays: -1 })
      .limit(3)
      .toArray();

    // 4. Top 5 by likes
    const topByLikes = await db.collection("tracks")
      .find({}, { projection: { audioUrl: 0, coverArt: 0 } })
      .sort({ likes: -1 })
      .limit(3)
      .toArray();

    // 5. SuperPhone member count (graceful fallback)
    let totalMembers = 0;
    try {
      const { getContacts } = await import("@/lib/superphone");
      const result = await getContacts(1); // fetch 1 just to get total
      totalMembers = result.contacts?.total || 0;
    } catch {
      // SuperPhone API key may be invalid — fallback to 0
      totalMembers = 0;
    }

    // 6. Map cover art to proxy URLs
    const mapTrack = (t: any) => ({
      _id: t._id,
      title: t.title || "--",
      plays: t.plays || 0,
      likes: t.likes || 0,
      dislikes: t.dislikes || 0,
      duration: t.duration || 0,
      date: t.date || null,
      coverArt: `/api/music/${t._id}/cover`,
    });

    return NextResponse.json({
      totalSongs,
      totalPlays,
      totalReacts,
      totalMembers,
      topByPlays: topByPlays.map(mapTrack),
      topByLikes: topByLikes.map(mapTrack),
    });
  } catch (error: any) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
}
