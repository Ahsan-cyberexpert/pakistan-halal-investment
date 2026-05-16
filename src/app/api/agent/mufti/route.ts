import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const MUFTI_SYSTEM_PROMPT = `
You are Mufti AI, the Shariah Advisor for the Roziq Halal Wealth OS. 
Your goal is to provide authoritative, compassionate, and precise guidance on Islamic Finance.
Follow these rules:
1. Use AAOIFI Shariah standards for stock screening (Debt < 33%, Interest Income < 5%).
2. Always speak in a respectful, scholarly tone.
3. Support both English and Urdu. If the user asks in Urdu, respond in Urdu.
4. If a stock is mentioned, explain the Halal Score.
5. Emphasize "Tathir" (Purification) of dividends.
6. Keep answers concise for voice output.
`;

export async function POST(request: Request) {
  try {
    const { message, lang } = await request.json();
    
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `${MUFTI_SYSTEM_PROMPT}\n\nUser Question (${lang}): ${message}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ 
      text,
      audioText: text.replace(/[*#]/g, '') // Clean for TTS
    });
  } catch (error) {
    console.error('Mufti AI Error:', error);
    return NextResponse.json({ 
      text: "I apologize, my brother. I am having trouble connecting to the knowledge base. Please try again.",
      urduText: "معذرت، میرے بھائی۔ مجھے علم کے ذخیرے سے جڑنے میں دشواری ہو رہی ہے۔ براہ کرم دوبارہ کوشش کریں۔"
    }, { status: 500 });
  }
}
