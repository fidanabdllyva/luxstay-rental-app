import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const type = searchParams.get('type') || undefined;
    const location = searchParams.get('location') || undefined;
    const entrepreneurId = searchParams.get('entrepreneurId') || undefined;

    const id = searchParams.get("id")

    if (id) {
      const apartment = await prisma?.apartment.findUnique({
        where: { id }
      })

      if(!apartment) {
         return NextResponse.json([], { status: 200 });
      }
      return NextResponse.json([apartment], { status: 200 });
    }

    const apartments = await prisma?.apartment.findMany()
    return NextResponse.json(
      {
        message: 'Apartments fetched successfully',
        data: apartments,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch apartments', error: (error as Error).message || String(error) },
      { status: 500 }
    );
  }
}