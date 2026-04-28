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
