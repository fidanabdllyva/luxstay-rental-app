import { hash } from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserById } from '@/services/userService'

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
    const { id } = params
    const body = await req.json()

    try {
        const updateData: any = {
            username: body.username,
            email: body.email,
            role: body.role,
            hostRequest: body.hostRequest,
            isBanned: body.isBanned,
            banDate: body.banDate ? new Date(body.banDate) : null,
            profileImage: body.profileImage ,
        }

        if (body.password) {
            const hashedPassword = await hash(body.password, 10)
            updateData.password = hashedPassword
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
        })

        return NextResponse.json(
            { message: 'User updated successfully', data: updatedUser },
            { status: 200 }
        )
    } catch (error) {
        console.error('PATCH /api/users/[id] error:', error)
        return NextResponse.json(
            { error: 'Failed to update user' },
            { status: 500 }
        )
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
