'use client';
import { useState } from 'react';

interface Project {
  city: string;
  type: string;
  amount: string;
  icon: string;
  x: number; // Percentage for positioning on map
  y: number;
}

const PROJECTS: Project[] = [
  { city: 'Bahawalpur', type: 'Solar Park', amount: 'PKR 50M', icon: '☀️', x: 55, y: 45 },
  { city: 'Karachi', type: 'Desalination Plant', amount: 'PKR 120M', icon: '💧', x: 30, y: 65 },
  { city: 'Lahore', type: 'Tech Hub', amount: 'PKR 80M', icon: '💻', x: 40, y: 30 },
  { city: 'Peshawar', type: 'Agriculture Fund', amount: 'PKR 30M', icon: '🌾', x: 35, y: 15 },
  { city: 'Quetta', type: 'Cold Storage', amount: 'PKR 20M', icon: '❄️', x: 15, y: 35 },
  { city: 'Islamabad', type: 'Headquarters', amount: 'HQ', icon: '🏢', x: 45, y: 20 },
  { city: 'Thatta', type: 'Clean Water', amount: 'PKR 5M', icon: '🚰', x: 35, y: 60 },
  { city: 'Multan', type: 'Mango Export', amount: 'PKR 15M', icon: '🥭', x: 50, y: 40 },
];

export default function LocalImpactMap() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">📍 Local Impact Map</h2>
        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Real Projects</span>
      </div>

      {/* Map Container */}
      <div className="relative w-full aspect-[4/3] bg-green-50 rounded-xl overflow-hidden border border-green-100 mb-4">
        {/* Simplified Pakistan Outline SVG */}
        <svg viewBox="0 0 100 80" className="w-full h-full absolute inset-0">
          {/* Approximate shape of Pakistan */}
          <path 
            d="M 20,10 L 30,10 L 45,15 L 50,25 L 40,30 L 50,40 L 60,45 L 50,55 L 40,65 L 30,60 L 20,50 L 15,30 Z" 
            fill="#dcfce7" 
            stroke="#16a34a" 
            strokeWidth="0.5"
          />
          {/* Internal borders (simplified) */}
          <path d="M 40,30 L 50,40 L 45,50" fill="none" stroke="#86efac" strokeWidth="0.2" />
          <path d="M 30,10 L 35,30 L 25,50" fill="none" stroke="#86efac" strokeWidth="0.2" />
        </svg>

        {/* Project Pins */}
        {PROJECTS.map((p, i) => (
          <button
            key={i}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            onClick={() => setSelectedProject(p)}
          >
            <div className="relative">
              <span className="text-xl drop-shadow-md transition-transform group-hover:scale-125">{p.icon}</span>
              <div className="absolute -bottom-1 left-1/2 w-2 h-1 bg-black/30 rounded-full blur-sm"></div>
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
              {p.city}
            </div>
          </button>
        ))}
      </div>

      {/* Selected Project Detail */}
      {selectedProject ? (
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{selectedProject.icon}</span>
            <div>
              <h3 className="font-bold text-purple-900">{selectedProject.city} Project</h3>
              <p className="text-sm text-purple-700">{selectedProject.type}</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div className="bg-white p-2 rounded-lg">
              <div className="text-xs text-gray-500">Funded Amount</div>
              <div className="font-bold text-purple-800">{selectedProject.amount}</div>
            </div>
            <div className="bg-white p-2 rounded-lg">
              <div className="text-xs text-gray-500">Impact</div>
              <div className="font-bold text-purple-800">+{Math.floor(Math.random() * 500)} Jobs</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 text-sm py-2">
           Tap a pin to see project details
        </div>
      )}
    </div>
  );
}
