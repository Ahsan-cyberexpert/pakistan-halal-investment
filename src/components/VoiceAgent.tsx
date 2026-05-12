'use client';
import { useState, useEffect, useRef } from 'react';

interface VoiceAgentProps {
  onCommand: (cmd: string) => void;
}

export default function VoiceAgent({ onCommand }: VoiceAgentProps) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'ur-PK';
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript.toLowerCase();
        onCommand(text);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, [onCommand]);

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ur-PK';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      speak('بولیں۔ ڈیپوزٹ، وِڈڈرا، یا بیلنس؟');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={toggleListening}
        className={`p-4 rounded-full shadow-lg transition-all duration-300 ${
          isListening ? 'bg-red-500 scale-110' : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {isListening ? '🔴 سن رہا ہے...' : '🎤 آواز سے کنٹرول'}
      </button>
    </div>
  );
}
