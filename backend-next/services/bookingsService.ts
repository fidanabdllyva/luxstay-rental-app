import { prisma } from '@/lib/prisma';


export async function getBookings() {
  return prisma.booking.findMany({
    include: {
      user: {
        select: {
          username: true,
          balance: true,
        },
      },
      apartment:{
        select:{
            pricePerNight:true,
            title:true
        }
      }
    },
  });
}

export async function getBookingsByApartmentId(apartmentId: string) {
  return prisma.booking.findMany({
    where: {
      apartmentId,
      status: "CONFIRMED", 
    },
    select: {
      startDate: true,
      endDate: true,
    },
  });
}

export async function getHostBookings(entrepreneurId?: string) {
  const whereClause = entrepreneurId
    ? {
        apartment: {
          entrepreneurId,
        },
      }
    : {};

  return prisma.booking.findMany({
    where: whereClause,
    include: {
      user: {
        select: {
          username: true,
          balance: true,
        },
      },
      apartment: {
        select: {
          pricePerNight: true,
          title: true,
          entrepreneurId: true,
        },
      },
    },
  });
}

export async function createBooking(data: {
  userId: string;
  apartmentId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status?: "PENDING" | "CONFIRMED" | "CANCELLED";
}) {
  return prisma.booking.create({
    data,
  });
}