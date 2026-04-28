import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
import path from "path";

// Load .env
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function seed() {
  const uri = process.env.DB_URL;
  const email = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASS;

  if (!uri || !email || !password) {
    console.error("Missing DB_URL, ADMIN_USER, or ADMIN_PASS in .env");
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    
    // Check if any admin already exists
    const adminCount = await db.collection("admins").countDocuments();
    
    if (adminCount > 0) {
      console.log("Admin already exists. Skipping seed.");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await db.collection("admins").insertOne({
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    console.log("Admin seeded successfully in database!");
    console.log("Email:", email);
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await client.close();
  }
}

seed();
