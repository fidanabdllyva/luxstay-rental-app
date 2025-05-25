import { NextResponse } from 'next/server';
import { getBookings } from '@/services/bookingsService';

export async function GET() {
  try {
    const bookings = await getBookings()

    return NextResponse.json(
       {
        message: 'Users fetched successfully',
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
