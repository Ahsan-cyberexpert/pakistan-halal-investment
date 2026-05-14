'use client';
import { useState } from 'react';

interface Project {
  city: string;
  type: string;
  amount: string;
  icon: string;
  x: number; // Percentage for positioning on map
  y: number;
  impact: string;
}

const PROJECTS: Project[] = [
  { city: 'Bahawalpur', type: 'Solar Sukuk', amount: 'PKR 250M', icon: '☀️', x: 55, y: 55, impact: 'Clean energy for 5,000 homes' },
  { city: 'Karachi', type: 'Blue Sukuk', amount: 'PKR 1.2B', icon: '💧', x: 30, y: 85, impact: 'Desalination for 50,000 residents' },
  { city: 'Lahore', type: 'Tech Sukuk', amount: 'PKR 400M', icon: '💻', x: 40, y: 35, impact: '2,000+ tech jobs created' },
  { city: 'Peshawar', type: 'Agri Sukuk', amount: 'PKR 150M', icon: '🌾', x: 35, y: 15, impact: 'Food security for local district' },
  { city: 'Gwadar', type: 'Port Sukuk', amount: 'PKR 5B', icon: '🚢', x: 15, y: 88, impact: 'Logistics hub expansion' },
  { city: 'Islamabad', type: 'Social Sukuk', amount: 'PKR 200M', icon: '🎓', x: 45, y: 20, impact: '10 new Shariah-schools' },
  { city: 'Faisalabad', type: 'Textile Sukuk', amount: 'PKR 300M', icon: '🧵', x: 42, y: 38, impact: 'Export capacity boost' },
];

export default function LocalImpactMap() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="premium-card p-8 overflow-hidden relative group">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Impact Radar</h2>
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Real-World Sukuk Projects</p>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black text-slate-400">PAKISTAN</div>
          <div className="px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live</div>
        </div>
      </div>

      <div className="relative w-full aspect-[4/5] bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-2xl group-hover:shadow-emerald-500/10 transition-all duration-700">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px]"></div>

        {/* Pakistan stylized map */}
        <svg viewBox="0 0 100 120" className="w-full h-full absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-1000 scale-110">
          <path 
            d="M 35,5 L 45,10 L 55,20 L 60,35 L 55,50 L 65,65 L 55,80 L 45,100 L 30,115 L 15,110 L 10,95 L 20,80 L 15,65 L 25,50 L 20,35 L 25,15 Z" 
            fill="none" 
            stroke="rgba(16, 185, 129, 0.4)" 
            strokeWidth="0.5"
            className="animate-pulse"
          />
          {/* Grid lines */}
          <path d="M 0,20 L 100,20 M 0,40 L 100,40 M 0,60 L 100,60 M 0,80 L 100,80 M 0,100 L 100,100" stroke="white" strokeWidth="0.05" opacity="0.1" />
          <path d="M 20,0 L 20,120 M 40,0 L 40,120 M 60,0 L 60,120 M 80,0 L 80,120" stroke="white" strokeWidth="0.05" opacity="0.1" />
        </svg>

        {/* Project Pins */}
        {PROJECTS.map((p, i) => (
          <button
            key={i}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 group/pin z-20 transition-all duration-500 ${
              selectedProject?.city === p.city ? 'scale-125' : 'hover:scale-110'
            }`}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            onClick={() => setSelectedProject(p)}
          >
            <div className="relative">
              {/* Pulsing ring */}
              <div className="absolute inset-0 bg-emerald-500/40 rounded-full animate-ping scale-150"></div>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-2xl border transition-all duration-300 ${
                selectedProject?.city === p.city 
                  ? 'bg-emerald-500 border-emerald-400 scale-110' 
                  : 'bg-slate-800 border-slate-700'
              }`}>
                {p.icon}
              </div>
            </div>
          </button>
        ))}

        {/* Floating Detail Card */}
        {selectedProject && (
          <div className="absolute bottom-6 left-6 right-6 p-5 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl animate-in slide-in-from-bottom-4 z-30">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-black text-white tracking-tight">{selectedProject.city}</h3>
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{selectedProject.type}</p>
              </div>
              <button 
                onClick={() => setSelectedProject(null)}
                className="text-white/40 hover:text-white transition-colors"
              >✕</button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white/5 rounded-2xl">
                <div className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Portfolio Allocation</div>
                <div className="text-sm font-black text-white">PKR {selectedProject.amount}</div>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-2xl">
                <div className="text-[8px] font-black text-emerald-400/70 uppercase tracking-widest mb-1">Direct Impact</div>
                <div className="text-[10px] font-black text-white leading-tight">{selectedProject.impact}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Your Sukuk holdings are directly funding these projects.
        </p>
      </div>
    </div>
  );
}
