import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { findSliderById, updateSlider, deleteSlider } from '@/services/sliderService';
import { SliderUpdateSchema } from '@/validation/slider';



export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const slider = await findSliderById(id);

    if (!slider) {
      return NextResponse.json({ message: 'Slider not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: 'Slider fetched successfully',
        data: slider,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch slider', error: String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();

    const parsed = SliderUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(parsed.error.issues[0], { status: 400 });
    }

    const updatedSlider = await updateSlider(id, parsed.data);

    return NextResponse.json(
      {
        message: 'Slider updated successfully',
        data: updatedSlider,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to update slider', error: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await deleteSlider(id);

    return NextResponse.json(
      { message: 'Slider deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to delete slider', error: String(error) },
      { status: 500 }
    );
  }
}
