import { getApartmentById, getApartments } from '@/services/apartmentsService';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const apartment = await getApartmentById(id); 
      if (!apartment) {
        return NextResponse.json(
          { message: 'Apartment not found', data: null },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          message: 'Apartment fetched successfully',
          data: apartment,
        },
        { status: 200 }
      );
    }

const apartments= await getApartments()
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
