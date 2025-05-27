import { NextRequest, NextResponse } from 'next/server';
import { getBookings, getHostBookings } from '@/services/bookingsService';

export async function GET(req: NextRequest) {
  try {
    const entrepreneurId = req.nextUrl.searchParams.get('entrepreneurId') || undefined;

    const bookings = entrepreneurId
      ? await getHostBookings(entrepreneurId)
      : await getBookings();

    return NextResponse.json(
      {
        message: 'Bookings fetched successfully',
        data: bookings,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}



