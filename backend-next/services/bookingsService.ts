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

