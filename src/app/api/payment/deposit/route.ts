// src/app/api/payment/deposit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { processSandboxPayment } from '@/lib/payment-sandbox';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, method, pin } = body;

    if (!amount || amount < 100) {
      return NextResponse.json({ error: 'Minimum amount is PKR 100' }, { status: 400 });
    }

    // Generate a unique Order ID for this transaction
    const orderId = `ORDER-${Date.now()}`;

    // Call our Sandbox Simulator
    const result = await processSandboxPayment({
      orderId,
      amount,
      method: method as any,
      pin // In production, send this via a secure token, not plain text
    });

    if (result.success) {
      // Here you would update your database balance
      // For hackathon, we just return success
      return NextResponse.json({
        status: 'SUCCESS',
        message: result.message,
        ref: result.bankReference
      });
    } else {
      return NextResponse.json({
        status: 'FAILED',
        message: result.message
      }, { status: 400 });
    }

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
