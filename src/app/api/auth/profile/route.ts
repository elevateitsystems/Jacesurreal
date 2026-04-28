import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

async function getAdmin(request: Request) {
  const token = (await request.headers.get("cookie"))?.split("; ").find(c => c.startsWith("admin-token="))?.split("=")[1];
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const client = await clientPromise;
    const db = client.db();
    return await db.collection("admins").findOne({ _id: new ObjectId(decoded.id) });
  } catch (e) {
    return null;
  }
}

export async function GET(request: Request) {
  const admin = await getAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Return emails and metadata (don't return password)
  const { password, ...safeAdmin } = admin;
  
  // Ensure emails array exists (handle legacy single email)
  if (!safeAdmin.emails) {
    safeAdmin.emails = [safeAdmin.email];
  }

  return NextResponse.json(safeAdmin);
}

export async function POST(request: Request) {
  const admin = await getAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { action, ...data } = await request.json();
  const client = await clientPromise;
  const db = client.db();

  if (action === "updatePassword") {
    const { currentPassword, newPassword } = data;
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) return NextResponse.json({ error: "Current password incorrect" }, { status: 400 });

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    await db.collection("admins").updateOne(
      { _id: admin._id },
      { $set: { password: hashedNewPassword } }
    );
    return NextResponse.json({ message: "Password updated successfully" });
  }

  if (action === "addEmail") {
    const { email } = data;
    const emails = admin.emails || [admin.email];
    if (emails.includes(email)) return NextResponse.json({ error: "Email already exists" }, { status: 400 });

    await db.collection("admins").updateOne(
      { _id: admin._id },
      { 
        $addToSet: { emails: email },
        // Also keep 'email' field synced for legacy login if needed
        $set: { email: email } 
      }
    );
    return NextResponse.json({ message: "Email added successfully" });
  }

  if (action === "deleteEmail") {
    const { email } = data;
    const emails = admin.emails || [admin.email];
    
    if (emails.length <= 1) {
      return NextResponse.json({ error: "Cannot delete the only email. Add a new one first." }, { status: 400 });
    }

    await db.collection("admins").updateOne(
      { _id: admin._id },
      { 
        $pull: { emails: email },
        // If we are deleting the primary email field, update it to the next available one
        $set: { email: emails.filter((e: string) => e !== email)[0] }
      }
    );
    return NextResponse.json({ message: "Email deleted successfully" });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
