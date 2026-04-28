import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Check if any admin already exists
    const adminCount = await db.collection("admins").countDocuments();
    
    if (adminCount > 0) {
      return NextResponse.json(
        { message: "Admin already exists. Use the login page." },
        { status: 400 }
      );
    }

    // Admin credentials from .env
    const email = process.env.ADMIN_USER;
    const password = process.env.ADMIN_PASS;

    if (!email || !password) {
      return NextResponse.json(
        { error: "ADMIN_USER or ADMIN_PASS not found in .env" },
        { status: 500 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await db.collection("admins").insertOne({
      email: email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return NextResponse.json({
      message: "Admin seeded successfully!",
      credentials: {
        email: email,
        password: password,
      },
      note: "You can now login at /auth/login",
    });
  } catch (error: any) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      { error: "Failed to seed admin user", details: error.message },
      { status: 500 }
    );
  }
}
