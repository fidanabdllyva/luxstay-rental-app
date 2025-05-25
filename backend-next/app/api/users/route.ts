import { NextResponse } from 'next/server';
import { getUsers } from '@/services/userService';

export async function GET() {
  try {
    const users = await getUsers()

    return NextResponse.json(
       {
        message: 'Users fetched successfully',
        data: users,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
