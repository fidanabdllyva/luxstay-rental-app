import { hash } from 'bcryptjs';
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
      apartments: true,
      bookings: true,
      reviews: true,
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
      reviews: true,
      bookings: {
        include: {
          apartment: true,
        },
      },
    }
  });
}




interface UpdateUserData {
  username: string;
  email: string;
  role?: string;
  hostRequest?: boolean;
  isBanned?: boolean;
  banDate?: string | null;
  profileImage?: string;
  password?: string;
}

export async function updateUser(id: string, body: UpdateUserData) {
  const existingEmail = await prisma.user.findFirst({
    where: {
      email: body.email,
      NOT: { id },
    },
  });
  if (existingEmail) {
    return { error: 'Email is already taken', status: 400 };
  }

  const existingUsername = await prisma.user.findFirst({
    where: {
      username: body.username,
      NOT: { id },
    },
  });
  if (existingUsername) {
    return { error: 'Username is already taken', status: 400 };
  }

  const updateData: any = {
    username: body.username,
    email: body.email,
    role: body.role,
    hostRequest: body.hostRequest,
    isBanned: body.isBanned,
    banDate: body.banDate ? new Date(body.banDate) : null,
    profileImage: body.profileImage,
  };

  if (body.password) {
    const hashedPassword = await hash(body.password, 10);
    updateData.password = hashedPassword;
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });
    return { data: updatedUser };
  } catch (error) {
    console.error('updateUser service error:', error);
    return { error: 'Failed to update user', status: 500 };
  }
}
