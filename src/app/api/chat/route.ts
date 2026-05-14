import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export async function POST(request: Request) {
  try {
    const { prompt, lang = 'ur' } = await request.json();

    const systemInstruction = `You are Roziq, a Shariah-compliant financial AI assistant built for the Pakistani market. 
    You help users manage wealth, calculate Zakat, understand Halal investments (PSX stocks, Sukuks), and provide financial literacy.
    You must always answer in ${lang === 'ur' ? 'Urdu (using Urdu script)' : 'English'}. Keep responses concise, supportive, and strictly Shariah-compliant. Do not give direct trading advice, but explain concepts.`;

    if (ai) {
      // Real Gemini AI call
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });
      return NextResponse.json({ reply: response.text });
    } else {
      // Fallback Mock Logic (When no API key is provided)
      await new Promise(r => setTimeout(r, 1500));
      
      let reply = lang === 'ur' ? 'میں روزق ہوں، آپ کا اسلامی مالیاتی مشیر۔ (Gemini API کی فی الحال کنفیگر نہیں ہے، یہ ایک ڈیمو جواب ہے۔)' : 'I am Roziq, your Islamic financial advisor. (Gemini API is not configured, this is a demo response.)';
      
      const lowerPrompt = prompt.toLowerCase();
      if (lowerPrompt.includes('zakat') || lowerPrompt.includes('زکوٰۃ')) {
        reply = lang === 'ur' 
          ? 'آپ کی کل زکوٰۃ کا حساب آپ کے موجودہ بیلنس اور سرمایہ کاری پر 2.5% کے حساب سے لگایا جاتا ہے۔ آپ ہمارے ڈیش بورڈ سے زکوٰۃ ادا کر سکتے ہیں۔'
          : 'Your total Zakat is calculated at 2.5% on your total wealth (cash + investments). You can pay it directly from the dashboard.';
      } else if (lowerPrompt.includes('invest') || lowerPrompt.includes('stock') || lowerPrompt.includes('سرمایہ')) {
        reply = lang === 'ur'
          ? 'میں تجویز کرتا ہوں کہ آپ ہمارے شریعت اسکرینر کا استعمال کرتے ہوئے حلال اسٹاکس یا سکوک میں سرمایہ کاری کریں۔ MEBL اور SYS اچھے آپشنز ہیں۔'
          : 'I recommend using our Shariah Screener to invest in Halal stocks or Sukuks. MEBL and SYS are historically solid options.';
      } else if (lowerPrompt.includes('halal') || lowerPrompt.includes('حلال')) {
        reply = lang === 'ur'
          ? 'روزق پر تمام سرمایہ کاری AAOIFI معیارات کے مطابق جانچی گئی ہے۔ ہم سود اور حرام کاروبار سے پاک سرمایہ کاری کو یقینی بناتے ہیں۔'
          : 'All investments on Roziq are audited according to AAOIFI standards. We ensure they are free from interest and haram business activities.';
      }

      return NextResponse.json({ reply, isMock: true });
    }
  } catch (error) {
    console.error('AI Error:', error);
    return NextResponse.json({ reply: 'Sorry, I encountered an error.', error: true }, { status: 500 });
  }
}
