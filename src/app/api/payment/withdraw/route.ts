import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { amount, method, pin } = data;

    // Simulate Payment Gateway Delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (pin !== '1234' && pin !== '0000') {
      return NextResponse.json({ success: false, message: 'Invalid bank PIN' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      ref: `RW-${Date.now().toString().slice(-6)}`,
      message: 'Withdrawal approved by gateway',
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gateway connection failed' }, { status: 500 });
  }
}
