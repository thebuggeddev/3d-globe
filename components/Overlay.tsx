import React from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';

export const Overlay: React.FC = () => {
  return (
    <div className="absolute inset-0 z-20 pointer-events-none text-[#5A3236] font-ui-mono">
      <div className="absolute inset-[6px] sm:inset-[8px] md:inset-[10px] rounded-[8px] md:rounded-[10px] border-[7px] sm:border-[9px] md:border-[12px] border-[#5D3038]" />

      <div className="absolute inset-[12px] sm:inset-[16px] md:inset-[22px] overflow-hidden rounded-[4px] md:rounded-[6px]">
        <div className="design-radial-lines" />

        <div className="relative flex h-full flex-col">
          {/* 1. NAVBAR */}
          <div className="h-[50px] md:h-[56px] border-b border-[#6a4044]/30 bg-[#EEE8E0]/92 pointer-events-auto relative z-20 px-2 sm:px-3 md:px-5">
            <div className="h-full flex items-center justify-between gap-3 md:gap-5">
              <div className="text-[#62363C]">
                <svg width="24" height="24" className="md:w-7 md:h-7" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="9" cy="9" r="2.4" />
                  <circle cx="14.2" cy="14.2" r="2.4" />
                  <circle cx="6" cy="14.6" r="2.2" />
                  <circle cx="12.7" cy="6.6" r="2.1" />
                </svg>
              </div>

              <div className="hidden md:flex items-center gap-8 text-[15px] font-medium leading-none tracking-[-0.01em]">
                <a href="#" className="hover:opacity-70 transition-opacity">MEMORABLE EXPERIENCE</a>
                <span className="rounded-full bg-[#10A11D] px-2 py-0.5 text-[12px] font-semibold text-white tracking-wide">NEW</span>
                <a href="#" className="hover:opacity-70 transition-opacity">WEB ANIMATIONS</a>
                <a href="#" className="hover:opacity-70 transition-opacity">LEARN WEB3D</a>
              </div>

              <div className="flex items-center gap-2 md:gap-4">
                <button className="h-8 md:h-9 min-w-[86px] sm:min-w-[98px] md:min-w-[112px] rounded-md border border-[#BFAEAA] bg-[#F6F2EC] px-2 sm:px-3 text-[12px] sm:text-[13px] md:text-[15px] font-medium leading-none flex items-center justify-between gap-2 hover:bg-[#f2ece4] transition-colors">
                  MENU <Menu size={17} strokeWidth={1.75} />
                </button>
                <button className="hidden md:flex h-9 w-9 items-center justify-center rounded-full border border-[#BFAEAA] bg-[#F6F2EC] hover:bg-[#f2ece4] transition-colors">
                  <X size={16} strokeWidth={1.8} />
                </button>
                <button className="h-8 md:h-9 min-w-[82px] sm:min-w-[92px] md:min-w-[102px] rounded-full bg-[#5C3138] px-3 sm:px-4 md:px-5 text-[#F4E9DD] text-[12px] sm:text-[13px] md:text-[15px] font-medium leading-none hover:bg-[#4f2930] transition-colors">
                  Account
                </button>
              </div>
            </div>
          </div>

          {/* 2. HERO CONTENT */}
          <div className="relative flex-1">
            <div className="absolute left-3 top-6 sm:left-6 sm:top-8 md:left-10 md:top-14 text-[#6A3D43]/90 uppercase tracking-[0.03em]">
              <div className="flex items-start gap-3">
                <span className="mt-[2px] text-[7px] sm:text-[8px] md:text-[9px] leading-none">▪ ▪</span>
                <p className="text-[12px] sm:text-[14px] md:text-[18px] leading-[1.35]">
                  THE ONLY COURSE YOU WILL NEED TO
                  <br />
                  MASTER WEB ANIMATIONS.
                </p>
              </div>
            </div>

            <div className="absolute right-8 top-10 md:right-12 md:top-14 hidden lg:block text-[#6A3D43]/90 uppercase tracking-[0.03em]">
              <div className="flex items-start gap-3 justify-end">
                <span className="mt-[2px] text-[9px] leading-none">▪ ▪</span>
                <p className="text-[18px] leading-[1.35] text-right">
                  YOU WILL BE A MASTER ON:
                  <br />
                  <span className="font-semibold text-[#5A3236]">TYPOGRAPHY ANIMATION</span>
                </p>
              </div>
            </div>

            <div className="absolute left-3 bottom-4 sm:left-6 sm:bottom-7 md:left-10 md:bottom-11 uppercase tracking-[0.04em] text-[#5A3236]">
              <div className="text-[12px] sm:text-[14px] md:text-[17px] leading-[1.2]">
                NEW COURSE:
                <br />
                MEMORABLE WEB EXPERIENCE <span className="not-italic">⚡🔥</span>
              </div>
            </div>

            <div className="absolute right-3 bottom-4 sm:right-6 sm:bottom-7 md:right-10 md:bottom-11 flex items-center gap-2 sm:gap-3 md:gap-4 pointer-events-auto uppercase tracking-[0.04em] text-[#5A3236]">
              <div className="text-[11px] sm:text-[13px] md:text-[17px] leading-[1.25] text-right max-w-[56vw] sm:max-w-[48vw] md:max-w-none">THE WEB ANIMATION ULTIMATE GUIDE</div>
              <button className="h-8 w-8 sm:h-9 sm:w-9 md:h-11 md:w-11 rounded-full border border-[#BDA8A6] text-[#5A3236] flex items-center justify-center bg-[#F2E5D6]/75 hover:bg-[#ead9c6] transition-colors">
                <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
