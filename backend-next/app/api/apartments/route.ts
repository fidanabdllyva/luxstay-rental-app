import { getApartments } from '@/services/apartmentsService';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ApartmentType } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const rawType = searchParams.get('type');
    const type = rawType && Object.values(ApartmentType).includes(rawType as ApartmentType)
      ? (rawType as ApartmentType)
      : undefined;

    const location = searchParams.get('location') || undefined;
    const entrepreneurId = searchParams.get('entrepreneurId') || undefined;

    const apartments = await getApartments({ type, location, entrepreneurId });

    return NextResponse.json(
      {
        message: 'Apartments fetched successfully',
        data: apartments,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch apartments', error: String(error) },
      { status: 500 }
    );
  }
}
