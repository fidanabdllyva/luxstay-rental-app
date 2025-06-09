import { NextRequest, NextResponse } from 'next/server';
import { createBooking, getBookings, getBookingsByApartmentId, getHostBookings } from '@/services/bookingsService';

export async function GET(req: NextRequest) {
  try {
    const urlParams = req.nextUrl.searchParams;
    const entrepreneurId = urlParams.get('entrepreneurId') || undefined;
    const apartmentId = urlParams.get('apartmentId') || undefined;

    let bookings;

    if (apartmentId) {
      bookings = await getBookingsByApartmentId(apartmentId);
    } else if (entrepreneurId) {
      bookings = await getHostBookings(entrepreneurId);
    } else {
      bookings = await getBookings(); 
    }

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


export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const newBooking = await createBooking({
            userId: data.userId,
            apartmentId: data.apartmentId,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            totalPrice: data.totalPrice,
            status: data.status,
        });
        return NextResponse.json(
          {
            message:"Booking created successfully",
            data:newBooking
          }
          , { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}



