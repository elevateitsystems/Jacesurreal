import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, phone, email } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    const apiKey = process.env.SUPPLER_PHONE_APIKEY;

    if (!apiKey) {
      console.error("SuperPhone API Key missing in environment");
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    // Split name into first and last for SuperPhone
    const nameParts = name ? name.trim().split(" ") : ["Fan"];
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    // Official SuperPhone API endpoint for creating a contact
    // Note: We use the server-side key to authorize the request
    const response = await fetch("https://api.superphone.io/v1/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        mobile: phone,
        firstName,
        lastName,
        email: email || undefined,
        tags: ["Website Contact Form"],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("SuperPhone API Error:", errorData);
      return NextResponse.json(
        { error: "Failed to sync with SuperPhone" },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: "Contact synced successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Failed to process contact" }, { status: 500 });
  }
}
