import { NextRequest, NextResponse } from "next/server";
import {
  getApartmentById,
  updateApartmentById,
  deleteApartmentById,
} from "@/services/apartmentsService";
import { apartmentReplaceSchema, apartmentUpdateSchema } from "@/validation/apartment";


type Params = { params: { id: string } };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const apartment = await getApartmentById(params.id);

    if (!apartment) {
      return NextResponse.json({ error: "Apartment not found" }, { status: 404 });
    }

    return NextResponse.json(apartment);
  } catch (error) {
    console.error("Error in GET /apartment/[id]:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const data = await request.json();
    const result = apartmentUpdateSchema.safeParse(data);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", issues: result.error.issues }, { status: 400 });
    }

    const updatedApartment = await updateApartmentById(params.id, result.data);
    return NextResponse.json(updatedApartment);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const data = await request.json();
    const result = apartmentReplaceSchema.safeParse(data);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", issues: result.error.issues }, { status: 400 });
    }

    const updatedApartment = await updateApartmentById(params.id, result.data);
    return NextResponse.json(updatedApartment);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await deleteApartmentById(params.id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
