import { loginUser } from '@/services/authService';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const result = await loginUser(body);

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result);
}
