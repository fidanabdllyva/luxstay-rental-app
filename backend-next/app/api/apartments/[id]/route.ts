import { NextResponse } from "next/server";
import { getApartmentById } from "@/services/apartmentsService";

type Params = { params: { id: string } };

export async function GET(_request: Request, { params }: Params) {
  try {
    const id = params.id;

    console.log("Fetching apartment with ID:", id);

    const apartment = await getApartmentById(id);

    if (!apartment) {
      console.warn("Apartment not found for ID:", id);
      return NextResponse.json(
        { message: "Apartment not found", data: null },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Apartment fetched successfully", data: apartment },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch apartment:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch apartment",
        error: (error as Error).message || String(error),
      },
      { status: 500 }
    );
  }
}

