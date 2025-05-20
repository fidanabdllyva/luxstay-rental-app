import { prisma } from '@/lib/prisma';
import { Apartment, ApartmentType } from '@prisma/client';

export async function getApartments(filters?: {
  type?: ApartmentType;
  location?: string;
  entrepreneurId?: string;
}): Promise<Apartment[]> {
  const { type, location, entrepreneurId } = filters || {};

  return prisma.apartment.findMany({
    where: {
      ...(type && { type }),
      ...(location && { location }),
      ...(entrepreneurId && { entrepreneurId }),
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      entrepreneur: true,
      reviews: true,
      wishlistedBy: true,
      bookings: true,
    },
  });
}


export async function getApartmentById(id: string) {
  return prisma.apartment.findUnique({
    where: { id },
    include: {
      entrepreneur: true,
      reviews: {
        include: {
          user: true,
        },
      },
      wishlistedBy: true,
      bookings: {
        include: {
          user: true,
        },
      },
    },
  });
}

