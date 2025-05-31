import { prisma } from "@/lib/prisma";

export type ReviewFilter = {
  userId?: string;
  apartmentId?: string;
  rating?: number;
};

export async function getReviews(filter: ReviewFilter = {}) {
  const where: any = {};
  if (filter.userId) where.userId = filter.userId;
  if (filter.apartmentId) where.apartmentId = filter.apartmentId;
  if (typeof filter.rating === "number") where.rating = filter.rating;

  return prisma.review.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      apartment: true,
    },
  });
}

export async function getReviewById(id: string) {
  return prisma.review.findUnique({
    where: { id },
    include: {
      user: true,
      apartment: true,
    },
  });
}

export async function createReview(data: {
  userId: string;
  apartmentId: string;
  rating: number;
  comment: string;
}) {
  return prisma.review.create({ data });
}

export async function updateReviewById(
  id: string,
  updatedData: Partial<{ rating: number; comment: string }>
) {
  return prisma.review.update({
    where: { id },
    data: updatedData,
  });
}

export async function deleteReviewById(id: string) {
  return prisma.review.delete({
    where: { id },
  });
}
