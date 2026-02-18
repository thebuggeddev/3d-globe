import React from 'react';
import { Menu } from 'lucide-react';

export const Overlay: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col z-20 font-sans text-[#3A2820]">
      
      {/* 1. TOP TICKER */}
      <div className="w-full bg-black text-white h-8 flex items-center overflow-hidden pointer-events-auto relative z-30">
        <div className="ticker-wrap">
          <div className="ticker">
            <span className="ticker__item">LAST 10 SPOTS AVAILABLE ⚡</span>
            <span className="ticker__item">NEW COURSE: MEMORABLE EXPERIENCE 🔥</span>
            <span className="ticker__item">LAST 10 SPOTS AVAILABLE ⚡</span>
            <span className="ticker__item">NEW COURSE: MEMORABLE EXPERIENCE 🔥</span>
             <span className="ticker__item">LAST 10 SPOTS AVAILABLE ⚡</span>
            <span className="ticker__item">NEW COURSE: MEMORABLE EXPERIENCE 🔥</span>
          </div>
        </div>
      </div>

      {/* 2. NAVBAR */}
      <div className="w-full flex justify-between items-center px-8 py-6 pointer-events-auto">
        {/* Logo Area */}
        <div className="flex items-center gap-2 text-[#5E3A28]">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="6" fillOpacity="0.8"/>
            <circle cx="18" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
          </svg>
        </div>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-bold tracking-tight">
          <a href="#" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            MEMORABLE EXPERIENCE 
            <span className="bg-[#4ADE80] text-[#064e3b] text-[10px] px-1.5 py-0.5 rounded-sm font-extrabold">NEW</span>
          </a>
          <a href="#" className="hover:opacity-70 transition-opacity">WEB ANIMATIONS</a>
          <a href="#" className="hover:opacity-70 transition-opacity">LEARN WEB3D</a>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#3A2820]/20 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#3A2820] hover:text-[#F5E6D8] transition-colors">
            Menu <Menu size={16} />
          </button>
          <button className="px-6 py-2 bg-[#5E3A28] text-[#F5E6D8] rounded text-xs font-bold uppercase tracking-wider hover:bg-[#4a2e20] transition-colors">
            Account
          </button>
        </div>
      </div>

      {/* 3. HERO CONTENT */}
      <div className="flex-1 w-full relative p-8 md:p-12">
        
        {/* Top Left Text */}
        <div className="absolute top-12 left-12 max-w-[280px]">
          <p className="text-sm font-medium leading-relaxed opacity-80 uppercase tracking-wide">
            The one course you will need to master web animations.
          </p>
        </div>

        {/* Bottom Left Text */}
        <div className="absolute bottom-12 left-12">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold opacity-60 uppercase tracking-widest">New Course:</span>
            <h2 className="text-lg md:text-xl font-bold uppercase tracking-tight flex items-center gap-2">
              Memorable Web Experience ⚡🔥
            </h2>
          </div>
        </div>

        {/* Bottom Right Text */}
        <div className="absolute bottom-12 right-12 flex items-end gap-4 pointer-events-auto">
          <div className="text-right">
            <h2 className="text-lg md:text-xl font-medium tracking-tight uppercase opacity-90">
              The Web Animation Ultimate Guide
            </h2>
          </div>
          <button className="w-12 h-12 rounded-full border border-[#3A2820]/30 flex items-center justify-center hover:bg-[#3A2820] hover:text-[#F5E6D8] transition-colors">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 17L17 17L17 7" /><path d="M17 17L7 7" /></svg>
          </button>
        </div>

      </div>
    </div>
  );
};