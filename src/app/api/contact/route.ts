import { NextResponse } from "next/server";
import { 
  getContacts, 
  createContact, 
  updateContact, 
  removeContact 
} from "@/lib/superphone";

// GET: Fetch contacts from SuperPhone
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const first = parseInt(searchParams.get("first") || "10");
    const after = searchParams.get("after") || undefined;

    const data = await getContacts(first, after);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("GET /api/contact error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create a new contact in SuperPhone
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email } = body;

    // Split name if only 'name' is provided
    let firstName = body.firstName;
    let lastName = body.lastName;

    if (!firstName && name) {
      const nameParts = name.trim().split(" ");
      firstName = nameParts[0];
      lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
    }

    if (!firstName) {
      return NextResponse.json({ error: "First name is required" }, { status: 400 });
    }

    const result = await createContact({
      firstName,
      lastName,
      email,
      mobile: phone || body.mobile,
    });

    if (result.createContact.contactUserErrors.length > 0) {
      return NextResponse.json(
        { errors: result.createContact.contactUserErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(result.createContact.contact);
  } catch (error: any) {
    console.error("POST /api/contact error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH: Update an existing contact in SuperPhone
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Contact ID is required" }, { status: 400 });
    }

    const result = await updateContact(body);

    if (result.updateContact.contactUserErrors.length > 0) {
      return NextResponse.json(
        { errors: result.updateContact.contactUserErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(result.updateContact.contact);
  } catch (error: any) {
    console.error("PATCH /api/contact error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove a contact from SuperPhone
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Contact ID is required" }, { status: 400 });
    }

    const result = await removeContact(id);

    if (result.removeContact.contactUserErrors.length > 0) {
      return NextResponse.json(
        { errors: result.removeContact.contactUserErrors },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      message: "Contact deleted successfully",
      removedContactId: result.removeContact.removedContactId 
    });
  } catch (error: any) {
    console.error("DELETE /api/contact error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
