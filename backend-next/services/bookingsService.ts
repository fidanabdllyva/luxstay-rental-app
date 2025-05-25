import { prisma } from '@/lib/prisma';


export async function getBookings() {
  return prisma.booking.findMany({
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          balance: true,
        },
      },
      apartment:{
        select:{
            pricePerNight:true
        }
      }
    },
  });
}
