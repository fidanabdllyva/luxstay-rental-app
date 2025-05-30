import { createSlider } from '@/services/sliderService';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { findSlidersByPage } from '@/services/sliderService';
import { SliderSchema } from '@/validation/slider';

export async function GET(request: NextRequest) {

  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || undefined;
    const sliders = await findSlidersByPage(page);

    return NextResponse.json(
      {
        message: 'Apartments fetched successfully',
        data: sliders,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch sliders', error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = SliderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(parsed.error.issues[0], { status: 400 });
    }

    const newSlider = await createSlider(parsed.data);

    return NextResponse.json(
      {
        message: 'Slider created successfully',
        data: newSlider,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Failed to create slider',
        error: (error as Error).message || String(error),
      },
      { status: 500 }
    );
  }
}

