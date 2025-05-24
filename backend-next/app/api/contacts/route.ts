import { createContact, getContacts } from "@/services/contactsService";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email") ?? undefined;
  const subject = searchParams.get("subject") ?? undefined;
  const isRead = searchParams.get("isRead");

  const contacts = await getContacts({
    email,
    subject,
    isRead: isRead === "true" ? true : isRead === "false" ? false : undefined,
  });

  return NextResponse.json(contacts);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, subject, message } = body;

    if (!fullName || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const newContact = await createContact({ fullName, email, subject, message });
    return NextResponse.json(newContact, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create contact." }, { status: 500 });
  }
}
