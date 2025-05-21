// services/userService.ts
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function registerUser({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}) {
  if (!username || !email || !password) {
    return { error: 'All fields are required', status: 400 };
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    return { error: 'User already exists', status: 400 };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
}

export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  if (!email || !password) {
    return { error: 'Email and password are required', status: 400 };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { error: 'Invalid credentials', status: 401 };
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return { error: 'Invalid credentials', status: 401 };
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
}
