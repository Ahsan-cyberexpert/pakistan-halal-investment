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

// Powerful Local Fatwa Knowledge Base (Fallback if Gemini API fails/missing)
const LOCAL_FATWAS: Record<string, { en: string; ur: string }> = {
  riba: {
    en: "Riba (interest) is strictly prohibited in Islam under Quran 2:275. In Roziq, we ensure zero Riba by filtering out conventional banks and companies with high interest income (>5%).",
    ur: "قرآن پاک (2:275) کے مطابق سود (ربا) قطعی حرام ہے۔ روزق میں، ہم روایتی بینکوں اور 5 فیصد سے زیادہ سودی آمدنی والی کمپنیوں کو فلٹر کر کے 100% حلال سرمایہ کاری یقینی بناتے ہیں۔"
  },
  zakat: {
    en: "Zakat is mandatory at 2.5% on wealth held for over a lunar year (Nisab). Roziq automates this calculation across your liquid cash, stocks, and Sukuks, linking directly to verified national distribution.",
    ur: "زکوٰۃ نصاب تک پہنچنے والی دولت پر سال گزرنے کے بعد 2.5 فیصد کے حساب سے فرض ہے۔ روزق آپ کے کیش، اسٹاکس اور سکوک پر زکوٰۃ کا خودکار حساب لگاتا ہے۔"
  },
  sukuk: {
    en: "Sukuks are Shariah-compliant asset-backed trust certificates, unlike conventional bonds which represent interest-bearing debt. Naya Pakistan Sukuks are fully Halal and backed by tangible government infrastructure.",
    ur: "سکوک شریعہ کے مطابق اثاثوں پر مبنی سرٹیفکیٹس ہیں، جبکہ روایتی بانڈز سودی قرض پر مبنی ہوتے ہیں۔ نیا پاکستان سکوک مکمل حلال اور حکومتی اثاثوں کی ضمانت سے لیس ہیں۔"
  },
  purification: {
    en: "Dividend purification (Tathir) is required when a Halal company earns a small fraction (<5%) of income from non-compliant sources. You must donate that exact percentage to charity without expecting reward.",
    ur: "اگر کسی حلال کمپنی کی آمدنی کا کچھ حصہ (5 فیصد سے کم) غیر شرعی ذرائع سے ہو، تو منافع کا اتنا حصہ صدقہ کرنا (تطہیر) ضروری ہے۔ روزق میں تطہیر کا خودکار ٹریکر موجود ہے۔"
  },
  meezan: {
    en: "Meezan Bank (MEBL) is Pakistan's premier Islamic bank. It operates strictly under Mudarabah and Murabahah principles with a Halal Score of 9.8/10. It is fully compliant.",
    ur: "میزان بینک (MEBL) پاکستان کا سب سے بڑا اسلامی بینک ہے۔ یہ مکمل طور پر مضاربہ اور مرابحہ کے اصولوں پر کام کرتا ہے اور اس کا حلال اسکور 9.8/10 ہے۔"
  },
  default: {
    en: "Based on AAOIFI Shariah standards, your investment is permitted as long as the company's debt-to-equity ratio is under 33% and illicit income is under 5%. Ensure regular dividend purification.",
    ur: "AAOIFI شریعہ معیارات کے مطابق، آپ کی سرمایہ کاری اس وقت تک جائز ہے جب تک کمپنی کا قرض 33 فیصد سے کم اور غیر شرعی آمدنی 5 فیصد سے کم ہو۔ منافع کی باقاعدہ تطہیر یقینی بنائیں۔"
  }
};

export async function POST(request: Request) {
  try {
    const { message, lang } = await request.json();
    const query = (message || '').toLowerCase();

    // Try Gemini AI first
    if (process.env.GEMINI_API_KEY) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const prompt = `${MUFTI_SYSTEM_PROMPT}\n\nUser Question (${lang}): ${message}`;
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        return NextResponse.json({ text, audioText: text.replace(/[*#]/g, '') });
      } catch (aiErr) {
        console.warn('Gemini AI failed, using local Fatwa knowledge base fallback:', aiErr);
      }
    }

    // Local Knowledge Base Fallback Matcher
    let matchKey = 'default';
    if (query.includes('riba') || query.includes('interest') || query.includes('سود') || query.includes('ربا')) matchKey = 'riba';
    else if (query.includes('zakat') || query.includes('زکو') || query.includes('charity')) matchKey = 'zakat';
    else if (query.includes('sukuk') || query.includes('bond') || query.includes('سکوک')) matchKey = 'sukuk';
    else if (query.includes('purif') || query.includes('tathir') || query.includes('تطہیر') || matchKey.includes('clean')) matchKey = 'purification';
    else if (query.includes('meezan') || query.includes('mebl') || query.includes('میزان')) matchKey = 'meezan';

    const fatwa = LOCAL_FATWAS[matchKey];
    const responseText = lang === 'ur' ? fatwa.ur : fatwa.en;

    return NextResponse.json({
      text: responseText,
      audioText: responseText.replace(/[*#]/g, '')
    });

  } catch (error) {
    console.error('Mufti AI Endpoint Error:', error);
    return NextResponse.json({ 
      text: "Based on AAOIFI Shariah standards, your investment is permitted as long as debt is under 33% and illicit income is under 5%. Ensure regular dividend purification.",
      audioText: "Based on AAOIFI Shariah standards, your investment is permitted as long as debt is under 33%."
    }, { status: 200 });
  }
}
