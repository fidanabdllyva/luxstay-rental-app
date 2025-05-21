import { prisma } from '@/lib/prisma';

export async function getUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      profileImage: true,
      balance: true,
      hostRequest: true,
      isBanned: true,
      banDate: true,
      createdAt: true,
      lastLogin: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      profileImage: true,
      balance: true,
      hostRequest: true,
      isBanned: true,
      banDate: true,
      createdAt: true,
      lastLogin: true,
    },
  });
}
