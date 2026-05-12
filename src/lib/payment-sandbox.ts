// src/lib/payment-sandbox.ts

export interface SandboxRequest {
  orderId: string;
  amount: number;
  method: 'jazzcash' | 'easypaisa' | 'bank';
  pin: string; // In real life, this goes directly to the bank, never to your server
}

export interface SandboxResponse {
  success: boolean;
  message: string;
  bankReference: string;
  transactionId: string;
}

// Simulates the external Bank API
export async function processSandboxPayment(data: SandboxRequest): Promise<SandboxResponse> {
  return new Promise((resolve) => {
    console.log(`[SANDBOX] Processing ${data.method} request for PKR ${data.amount}...`);

    // Simulate network delay (3 seconds)
    setTimeout(() => {
      // 90% Success rate for demo, 10% Failure to show error handling
      const isSuccess = Math.random() > 0.1;

      if (isSuccess) {
        resolve({
          success: true,
          message: 'Transaction Successful',
          bankReference: `REF-${Math.floor(Math.random() * 1000000)}`,
          transactionId: `TXN-${Date.now()}`
        });
      } else {
        resolve({
          success: false,
          message: 'Transaction Failed: Insufficient Balance or Invalid PIN',
          bankReference: '',
          transactionId: ''
        });
      }
    }, 3000);
  });
}
