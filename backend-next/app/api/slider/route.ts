import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { findSlidersByPage } from '@/services/sliderService';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || undefined;

  try {
    const sliders = await findSlidersByPage(page);
    return NextResponse.json(sliders);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch sliders', error: String(error) },
      { status: 500 }
    );
  }
}
