import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection("tracks").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Track not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Track deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete track" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db();

    // Remove _id if it exists in body to prevent update error
    const { _id, ...updateData } = body;
    
    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    const result = await db.collection("tracks").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Track not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Track updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update track" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action } = body; // 'like', 'unlike', 'play'

    const client = await clientPromise;
    const db = client.db();

    let update: any = {};
    if (action === 'like') {
      update = { $inc: { likes: 1 } };
    } else if (action === 'unlike') {
      update = { $inc: { likes: -1 } };
    } else if (action === 'dislike') {
      update = { $inc: { dislikes: 1 } };
    } else if (action === 'undislike') {
      update = { $inc: { dislikes: -1 } };
    } else if (action === 'play') {
      update = { $inc: { plays: 1 } };
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const result = await db.collection("tracks").updateOne(
      { _id: new ObjectId(id) },
      update
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Track not found" }, { status: 404 });
    }

    return NextResponse.json({ message: `Track ${action} updated successfully` });
  } catch (error: any) {
    console.error("Music PATCH error:", error);
    return NextResponse.json({ error: "Failed to update track stats" }, { status: 500 });
  }
}
