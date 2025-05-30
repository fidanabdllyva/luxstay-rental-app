import { hash,compare } from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserById, updateUser } from '@/services/userService'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params

    try {
        const user = await getUserById(id)

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({ message: 'User fetched successfully', data: user }, { status: 200 })
    } catch (error) {
        console.error('GET /api/users/[id] error:', error)
        return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
    }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await req.json();

  const { currentPassword, password: newPassword, ...rest } = body;

  const user = await prisma.user.findUnique({
    where: { id },
    select: { password: true },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (newPassword) {
    if (!currentPassword) {
      return NextResponse.json(
        { error: 'Current password is required to change password' },
        { status: 400 }
      );
    }

    const isMatch = await compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    const isSame = await compare(newPassword, user.password);
    if (isSame) {
      return NextResponse.json(
        { error: 'New password must be different from current password' },
        { status: 400 }
      );
    }
  }

  const updateData: any = { ...rest };

  if (newPassword) {
    const hashed = await hash(newPassword, 10);
    updateData.password = hashed;
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(
      { message: 'User updated successfully', data: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error('PATCH /api/users/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}


export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params

    try {
        await prisma.user.delete({
            where: { id },
        })

        return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 })
    } catch (error) {
        console.error('DELETE /api/users/[id] error:', error)
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
    }
}
