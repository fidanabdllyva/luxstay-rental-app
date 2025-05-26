import { createApartment,getApartments } from '@/services/apartmentsService';
import { ApartmentSchema } from '@/validation/apartment';
import { ApartmentType } from '@prisma/client';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';



export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const entrepreneurId = url.searchParams.get('entrepreneurId') || undefined;
    const type = url.searchParams.get('type') as ApartmentType | undefined;
    const location = url.searchParams.get('location') || undefined;

    const apartments = await getApartments({
      entrepreneurId,
      type,
      location,
    });

    return NextResponse.json(
      {
        message: 'Apartments fetched successfully',
        data: apartments,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Failed to fetch apartments',
        error: (error as Error).message || String(error),
      },
      { status: 500 }
    );
  }
}



export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = ApartmentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(parsed.error.issues[0], { status: 400 });
    }

    await createApartment(parsed.data);

    return NextResponse.json(
      { message: "Apartment created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Failed to fetch apartments',
        error: (error as Error).message || String(error),
      },
      { status: 500 }
    );
  }
}