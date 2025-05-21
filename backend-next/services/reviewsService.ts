import { prisma } from '@/lib/prisma';

export async function getReviews() {
    return prisma.review.findMany()
}

export async function getReviewsById(id: string) {
    return prisma.review.findUnique({
        where: { id }
    })
}