import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Return a simple test response
    return NextResponse.json({
      status: 'success',
      message: 'Test API is working',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ error: 'Test failed' }, { status: 500 });
  }
}
