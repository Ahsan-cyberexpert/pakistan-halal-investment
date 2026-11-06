'use client';

interface LanguageSelectProps {
  onSelect: (lang: 'en' | 'ur') => void;
}

export default function LanguageSelect({ onSelect }: LanguageSelectProps) {
  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center px-8 overflow-hidden">
      {/* Ambient Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,150,105,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        {/* Logo */}
        <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-[2.5rem] flex items-center justify-center text-5xl mb-6 shadow-2xl shadow-emerald-900/60">
          
        </div>
        <h1 className="text-4xl font-black text-white tracking-tighter mb-1">Roziq</h1>
        <p className="text-emerald-400 text-xs font-black uppercase tracking-[0.3em] mb-16">Halal Wealth OS</p>

        {/* Language Prompt */}
        <div className="w-full text-center mb-8">
          <p className="text-white/50 text-sm font-medium mb-1">Choose your language</p>
          <p className="text-white/30 text-xs" dir="rtl">اپنی زبان منتخب کریں</p>
        </div>

        {/* Language Buttons */}
        <div className="w-full flex flex-col gap-4">
          <button
            onClick={() => onSelect('en')}
            className="group w-full flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-emerald-600 hover:border-emerald-500 transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-white/20 transition-colors"><span className="text-sm font-bold text-white">EN</span></div>
              <div className="text-left">
                <div className="text-white font-black text-lg">English</div>
                <div className="text-white/40 text-xs font-medium">Left to Right</div>
              </div>
            </div>
            <span className="text-white/30 group-hover:text-white transition-colors text-xl">→</span>
          </button>

          <button
            onClick={() => onSelect('ur')}
            className="group w-full flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-emerald-600 hover:border-emerald-500 transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-xl"
            dir="rtl"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-white/20 transition-colors"><span className="text-sm font-bold text-white">UR</span></div>
              <div className="text-right">
                <div className="text-white font-black text-lg">اردو</div>
                <div className="text-white/40 text-xs font-medium">دائیں سے بائیں</div>
              </div>
            </div>
            <span className="text-white/30 group-hover:text-white transition-colors text-xl">←</span>
          </button>
        </div>

        <p className="mt-12 text-white/20 text-xs text-center font-medium uppercase tracking-widest">
          You can change this later in Settings
        </p>
      </div>
    </div>
  );
}
