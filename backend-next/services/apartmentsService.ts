import { prisma } from '@/lib/prisma';
import { ApartmentSchema } from '@/validation/apartment';
import { Apartment, ApartmentType, Feature, Rule } from '@prisma/client';

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


export async function createApartment(rawData: unknown) {
  try {
    const data = ApartmentSchema.parse(rawData);

    const entrepreneur = await prisma.user.findUnique({
      where: { id: data.entrepreneurId },
    });

    if (!entrepreneur || entrepreneur.role !== "HOST") {
      throw new Error("Entrepreneur not found or not a HOST.");
    }

    const result = await prisma.apartment.create({
      data: {
        title: data.title,
        type: data.type,
        location: data.location,
        pricePerNight: data.pricePerNight,
        coverImage: data.coverImage,
        images: data.images,
        description: data.description,
        features: data.features,
        rules: data.rules,
        entrepreneurId: data.entrepreneurId,
      },
    });

    return result;
  } catch (error) {
    console.error("Error creating apartment:", error);
    throw error;
  }
}


export async function deleteApartmentById(id: string) {
  const res = await prisma.apartment.delete({
    where: { id },
  });

  return {
    message: "Apartment deleted successfully",
    data: res,
  };
}

export async function updateApartmentById(
  id: string,
  updatedData: Partial<{
    title: string;
    type: ApartmentType;
    location: string;
    pricePerNight: number;
    coverImage: string;
    images: string[];
    description: string;
    features: Feature[];
    rules: Rule[];
  }>
) {
  const res = await prisma.apartment.update({
    where: { id },
    data: {
      ...updatedData,
      ...(updatedData.features && {
        features: updatedData.features as Feature[],
      }),
      ...(updatedData.rules && {
        rules: updatedData.rules as Rule[],
      }),
    },
    include: {
      entrepreneur: true,
      reviews: true,
      wishlistedBy: true,
      bookings: true,
    },
  });

  return {
    message: "Apartment updated successfully",
    data: res,
  };
}

export async function toggleWishlist(apartmentId: string, userId: string) {
  if (!userId) {
    throw new Error("userId is required");
  }

  const apartment = await prisma.apartment.findUnique({
    where: { id: apartmentId },
    include: { wishlistedBy: true },
  });

  if (!apartment) {
    throw new Error("Apartment not found");
  }

  const isWishlisted = apartment.wishlistedBy.some(user => user.id === userId);

  const updatedApartment = await prisma.apartment.update({
    where: { id: apartmentId },
    data: {
      wishlistedBy: {
        [isWishlisted ? "disconnect" : "connect"]: { id: userId },
      },
    },
    include: { wishlistedBy: true },
  });

  return {
    message: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
    wishlistedBy: updatedApartment.wishlistedBy,
  };
}
