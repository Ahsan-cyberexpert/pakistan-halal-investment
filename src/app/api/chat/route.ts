import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export async function POST(request: Request) {
  try {
    const { prompt, lang = 'ur', context = { balance: 0, holdings: [], transactions: [] } } = await request.json();
    const query = (prompt || '').toLowerCase();
    const { balance, holdings } = context;

    // Detect if the user's prompt is in Urdu/Arabic script
    const isUrduPrompt = /[\u0600-\u06FF]/.test(prompt || '');
    const detectedLang = isUrduPrompt ? 'ur' : (prompt ? 'en' : lang);

    // Calculate dynamic user values
    const totalInvested = holdings.reduce((sum: number, h: any) => sum + (h.invested || 0), 0);
    const totalWealth = balance + totalInvested;
    const zakatOwed = totalWealth >= 300000 ? totalWealth * 0.025 : 0;
    const holdingsList = holdings.map((h: any) => `${h.symbol} (${h.units.toFixed(1)} shares)`).join(', ') || 'No active stocks';

    const systemInstruction = `You are Roziq AI, the Sovereign Shariah Wealth Guardian and Certified Mufti for the user.
    You have direct access to the user's real-time financial accounts:
    - Liquid Cash Balance: PKR ${balance.toLocaleString()}
    - Stock Portfolio: ${holdingsList} (Total Invested: PKR ${totalInvested.toLocaleString()})
    - Total Net Worth: PKR ${totalWealth.toLocaleString()}
    - Mandatory Zakat Owed (2.5%): PKR ${zakatOwed.toLocaleString()}

    CRITICAL MANDATORY RULE: You MUST respond entirely in ${detectedLang === 'ur' ? 'URDU language (using clean Nastaliq Urdu script)' : 'ENGLISH language'}. Do NOT respond in English if Urdu is requested!
    Follow AAOIFI Shariah standards. Keep answers concise, clear, and perfectly formatted for voice synthesis.`;

    if (ai) {
      try {
        const enrichedContents = detectedLang === 'ur' 
          ? `[Please respond strictly in clean Urdu script to the following query]: ${prompt}` 
          : `[Please respond strictly in English to the following query]: ${prompt}`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: enrichedContents,
          config: { systemInstruction, temperature: 0.7 }
        });
        const text = response.text;
        return NextResponse.json({ 
          reply: text,
          audioText: text.replace(/[*#]/g, '') 
        });
      } catch (aiErr) {
        console.warn('Gemini API failed, using smart local context KB fallback:', aiErr);
      }
    }

    // Smart Local Context-Aware Knowledge Base Fallback
    let replyTextEn = '';
    let replyTextUr = '';

    if (query.includes('balance') || query.includes('worth') || query.includes('بیلنس') || query.includes('رقم') || query.includes('پیسے') || query.includes('کیا ہے')) {
      replyTextEn = `Your total net worth is PKR ${totalWealth.toLocaleString()}, comprising PKR ${balance.toLocaleString()} in liquid cash and PKR ${totalInvested.toLocaleString()} in Halal stocks (${holdingsList}).`;
      replyTextUr = `آپ کا کل اثاثہ ${totalWealth.toLocaleString()} روپے ہے، جس میں ${balance.toLocaleString()} روپے کیش اور ${totalInvested.toLocaleString()} روپے حلال اسٹاکس (${holdingsList}) میں شامل ہیں۔`;
    } 
    else if (query.includes('zakat') || query.includes('زکو') || query.includes('charity')) {
      replyTextEn = zakatOwed > 0 
        ? `Based on your total wealth of PKR ${totalWealth.toLocaleString()}, your mandatory 2.5% Zakat is PKR ${zakatOwed.toLocaleString()}. You can pay this directly from the Zakat tab.` 
        : `Your wealth of PKR ${totalWealth.toLocaleString()} is below the Zakat Nisab threshold. No mandatory Zakat is due at this time.`;
      replyTextUr = zakatOwed > 0
        ? `آپ کے کل اثاثے ${totalWealth.toLocaleString()} روپے کے حساب سے آپ کی 2.5% فرض زکوٰۃ ${zakatOwed.toLocaleString()} روپے بنتی ہے۔ آپ اسے زکوٰۃ ٹیب سے ادا کر سکتے ہیں۔`
        : `آپ کی دولت نصاب سے کم ہے، اس لیے فی الحال آپ پر زکوٰۃ فرض نہیں ہے۔`;
    }
    else if (query.includes('stock') || query.includes('share') || query.includes('اسٹاک') || query.includes('سرمایہ') || query.includes('portfolio') || query.includes('دکھائیں')) {
      replyTextEn = holdings.length > 0 
        ? `You currently hold ${holdingsList}. I recommend monitoring your dividend purification and exploring Naya Pakistan Sukuks for stable, asset-backed Halal returns.`
        : `You have no active stock investments. Use our Halal Marketplace to invest in Shariah-compliant market leaders like Meezan Bank (MEBL) or Lucky Cement (LUCK).`;
      replyTextUr = holdings.length > 0
        ? `آپ کے پاس اس وقت ${holdingsList} موجود ہیں۔ مزید حلال منافع کے لیے نیا پاکستان سکوک میں سرمایہ کاری پر غور کریں۔`
        : `آپ نے ابھی تک کسی اسٹاک میں سرمایہ کاری نہیں کی ہے۔ حلال مارکیٹ پلیس کے ذریعے میزان بینک یا لکی سیمنٹ میں سرمایہ کاری کریں۔`;
    }
    else if (query.includes('riba') || query.includes('interest') || query.includes('سود') || query.includes('ربا') || query.includes('halal') || query.includes('حلال') || query.includes('میزان')) {
      replyTextEn = "Roziq operates strictly under AAOIFI Shariah standards. We ensure 100% Riba-free wealth management by filtering out conventional banks and companies with >5% illicit income.";
      replyTextUr = "روزق مکمل طور پر AAOIFI شریعہ معیارات پر کام کرتا ہے۔ ہم روایتی بینکوں اور سودی کمپنیوں کو فلٹر کر کے 100% حلال اور سود سے پاک مالیات یقینی بناتے ہیں۔";
    }
    else if (query.includes('sukuk') || query.includes('bond') || query.includes('سکوک')) {
      replyTextEn = "Naya Pakistan Shariah Sukuks are government-backed asset certificates offering stable, Halal returns without Riba. Perfect for overseas Pakistanis and conservative investors.";
      replyTextUr = "نیا پاکستان شریعہ سکوک حکومتی اثاثوں کی ضمانت پر مبنی سرٹیفکیٹس ہیں جو سود سے پاک حلال منافع فراہم کرتے ہیں۔ اوورسیز پاکستانیوں کے لیے بہترین انتخاب ہیں۔";
    }
    else if (query.includes('health') || query.includes('family') || query.includes('صحت') || query.includes('فیملی')) {
      replyTextEn = "The Family Health Savings Pool is a Takaful-based emergency fund. You can allocate monthly savings for your parents, spouse, and children, and file instant medical claims when needed.";
      replyTextUr = "فیملی ہیلتھ سیونگ پول ایک تکافل پر مبنی ایمرجنسی فنڈ ہے۔ آپ اپنے والدین، شریک حیات اور بچوں کے لیے ماہانہ بچت کر سکتے ہیں اور بوقت ضرورت فوری کلیم کر سکتے ہیں۔";
    }
    else {
      replyTextEn = `I am Roziq AI, your Sovereign Shariah Wealth Guardian. Your liquid balance is PKR ${balance.toLocaleString()}. Ask me to calculate your Zakat, review your stocks, or clarify Islamic finance rules.`;
      replyTextUr = `میں روزق اے آئی ہوں، آپ کا اسلامی مالیاتی مشیر۔ آپ کا کیش بیلنس ${balance.toLocaleString()} روپے ہے۔ مجھ سے زکوٰۃ، حلال اسٹاکس یا شرعی اصولوں کے بارے میں کچھ بھی پوچھیں۔`;
    }

    const finalReply = detectedLang === 'ur' ? replyTextUr : replyTextEn;

    return NextResponse.json({ 
      reply: finalReply,
      audioText: finalReply.replace(/[*#]/g, ''),
      isMock: true 
    });

  } catch (error) {
    console.error('Roziq AI Chat Error:', error);
    return NextResponse.json({ 
      reply: "I am Roziq AI, your Sovereign Shariah Wealth Guardian. Ask me to calculate your Zakat, review your stocks, or clarify Islamic finance rules.",
      audioText: "I am Roziq AI, your Sovereign Shariah Wealth Guardian.",
      error: true 
    }, { status: 200 });
  }
}
