import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';



type Params = { params: { id: string } };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const booking = await prisma.booking.findUnique({ where: { id: params.id } });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ data: booking });
  } catch (error) {
    console.error("GET /bookings/[id] error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();
    const validStatuses = ["PENDING", "CONFIRMED", "CANCELLED"];

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const existingBooking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: { user: true },
    });

    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const user = existingBooking.user;
    const previousStatus = existingBooking.status;
    const totalPrice = existingBooking.totalPrice;

    if (status === "CONFIRMED" && previousStatus === "PENDING") {
      if (user.balance < totalPrice) {
        return NextResponse.json(
          { error: "User has insufficient balance" },
          { status: 400 }
        );
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          balance: user.balance - totalPrice,
        },
      });
    }

    if (status === "CANCELLED" && previousStatus === "CONFIRMED") {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          balance: user.balance + totalPrice,
        },
      });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json(
      { message: "Booking status updated", data: updatedBooking },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update booking status:", error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}



