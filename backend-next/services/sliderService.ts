import { prisma } from '@/lib/prisma';

export async function findSlidersByPage(page?: string) {
  return prisma.slider.findMany({
    where: page ? { page } : {},
    orderBy: { id: 'asc' },
  });
}
