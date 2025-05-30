import { prisma } from '@/lib/prisma';

export async function findSlidersByPage(page?: string) {
  return prisma.slider.findMany({
    where: page ? { page } : {},
    orderBy: { id: 'asc' },
  });
}

export async function createSlider(data: {
  title: string;
  page: string;
  imageURL: string;
}) {
  return prisma.slider.create({
    data,
  });
}

export async function findSliderById(id: string) {
  return prisma.slider.findUnique({
    where: { id }, 
  });
}

export async function updateSlider(id: string, data: {
  title?: string;
  page?: string;
  imageUrl?: string;
}) {
  return prisma.slider.update({
    where: { id },
    data,
  });
}

export async function deleteSlider(id: string) {
  return prisma.slider.delete({
    where: { id },
  });
}
