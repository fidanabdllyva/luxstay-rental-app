import { NextResponse } from "next/server";
import {
  getContactById,
  updateContactById,
  deleteContactById,
} from "@/services/contactsService";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const contact = await getContactById(params.id);
    if (!contact) {
      return NextResponse.json({ error: "Contact not found." }, { status: 404 });
    }
    return NextResponse.json(contact);
  } catch {
    return NextResponse.json({ error: "Error fetching contact." }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const updatedData = await req.json();
    const updated = await updateContactById(params.id, updatedData);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update contact." }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await deleteContactById(params.id);
    return NextResponse.json({ message: "Contact deleted." });
  } catch {
    return NextResponse.json({ error: "Failed to delete contact." }, { status: 500 });
  }
}
