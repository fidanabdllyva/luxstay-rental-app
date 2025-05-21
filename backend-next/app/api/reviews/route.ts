import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getReviews } from '@/services/reviewsService';

export async function GET(request: NextRequest) {

    try {

        const sliders = await getReviews()

        return NextResponse.json(
            {
                message: 'Reviews fetched successfully',
                data: sliders,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: 'Failed to fetch reviews', error: String(error) },
            { status: 500 }
        );
    }
}
