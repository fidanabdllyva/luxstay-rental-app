import { hash } from 'bcryptjs'
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

  const result = await updateUser(id, body);

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(
    { message: 'User updated successfully', data: result.data },
    { status: 200 }
  );
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
