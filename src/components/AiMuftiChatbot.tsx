'use client';
import { useState } from 'react';

export default function AiMuftiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'mufti', text: string}[]>([
    { role: 'mufti', text: 'Assalamu Alaikum! I am your AI Shariah Advisor. Ask me anything about Halal investing, Zakat, or AAOIFI standards.' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    const currentInput = input;
    setInput('');
    
    // Simulate AI response based on keywords
    setTimeout(() => {
      let response = 'According to AAOIFI standards, please ensure the core business is halal and interest-bearing debt is less than 33% of market cap.';
      if (currentInput.toLowerCase().includes('purification') || currentInput.toLowerCase().includes('impure')) {
        response = 'If a company earns a small amount from interest (under 5%), you must purify your dividends by donating that exact percentage to charity without expecting spiritual reward.';
      } else if (currentInput.toLowerCase().includes('sukuk')) {
        response = 'Sukuk are Islamic financial certificates, similar to bonds in Western finance, but they comply with Shariah. They represent ownership in an underlying asset rather than a debt obligation.';
      }
      setMessages(prev => [...prev, { role: 'mufti', text: response }]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-emerald-700 text-white p-4 rounded-full shadow-2xl hover:bg-emerald-800 transition-transform hover:scale-105 z-50 flex items-center justify-center"
      >
        <span className="text-2xl mr-2">👳🏽‍♂️</span>
        <span className="font-bold hidden md:inline">Ask AI Mufti</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden">
          <div className="bg-emerald-700 text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">👳🏽‍♂️</span>
              <h3 className="font-bold">AI Shariah Advisor</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200 text-xl">✕</button>
          </div>
          
          <div className="flex-1 p-4 h-80 overflow-y-auto bg-gray-50 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-white border-t border-gray-100 flex items-center space-x-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your question..."
              className="flex-1 p-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button 
              onClick={handleSend}
              className="bg-emerald-700 text-white p-2 rounded-xl hover:bg-emerald-800"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
