import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { amount, method, pin } = data;

    // Simulate Payment Gateway Delay (JazzCash / EasyPaisa / Bank)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Gateway validation simulation
    if (amount > 1000000) {
      return NextResponse.json({ success: false, message: 'Amount exceeds daily limit.' }, { status: 400 });
    }

    if (pin !== '1234' && pin !== '0000') { // allow dummy pins for testing
      return NextResponse.json({ success: false, message: 'Invalid bank PIN' }, { status: 400 });
    }

    // Return success to the client, which will then commit the transaction to our local db
    return NextResponse.json({
      success: true,
      ref: `RC-${Date.now().toString().slice(-6)}`,
      message: 'Deposit approved by gateway',
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gateway connection failed' }, { status: 500 });
  }
}
