import { createReview, getReviews } from "@/services/reviewsService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const filter = {
    userId: searchParams.get("userId") ?? undefined,
    apartmentId: searchParams.get("apartmentId") ?? undefined,
    rating: searchParams.get("rating")
      ? Number(searchParams.get("rating"))
      : undefined,
  };

  try {
    const reviews = await getReviews(filter);
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const newReview = await createReview(data);
    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
