import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

export async function GET(request: Request) {
  try {
    const token = (await request.headers.get("cookie"))?.split("; ").find(c => c.startsWith("admin-token="))?.split("=")[1];
    
    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    return NextResponse.json({ 
      authenticated: true, 
      role: decoded.role,
      email: decoded.email 
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}
