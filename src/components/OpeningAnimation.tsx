import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { SpoteraMarkSvg } from './SpoteraLogo';
import { Sparkles, ArrowRight } from 'lucide-react';

export const OpeningAnimation: React.FC = () => {
  const { showOpeningAnimation, dismissOpeningAnimation } = useApp();
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (!showOpeningAnimation) return;

    // Smooth transition starts at 2.2s, dismisses at 2.6s
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2200);

    const dismissTimer = setTimeout(() => {
      dismissOpeningAnimation();
    }, 2600);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(dismissTimer);
    };
  }, [showOpeningAnimation, dismissOpeningAnimation]);

  if (!showOpeningAnimation) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-between overflow-hidden select-none bg-gradient-to-b from-[#0A2540] via-[#0E3D6E] to-[#125492] text-white transition-opacity duration-500 ease-in-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* 1. Atmospheric Sky Elements: Soft Stars & Warm Dawn Glow */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Warm Horizon Glow */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-t from-[#FD9302]/30 via-[#0D9CFD]/25 to-transparent rounded-full blur-3xl" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-white/10 rounded-full blur-3xl" />

        {/* Twinkling ambient night/dawn stars */}
        {[
          { top: '12%', left: '15%', size: 3, delay: '0s' },
          { top: '18%', left: '82%', size: 2.5, delay: '0.3s' },
          { top: '26%', left: '28%', size: 2, delay: '0.6s' },
          { top: '32%', left: '72%', size: 3.5, delay: '0.2s' },
          { top: '10%', left: '55%', size: 2, delay: '0.8s' },
          { top: '22%', left: '44%', size: 3, delay: '0.5s' },
        ].map((star, idx) => (
          <div
            key={idx}
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: star.delay,
            }}
            className="absolute rounded-full bg-white shadow-[0_0_8px_white] animate-pulse"
          />
        ))}
      </div>

      {/* 2. UAE SKYLINE & BUILDINGS ILLUSTRATION (Background Vector) */}
      <div className="absolute bottom-0 inset-x-0 h-44 sm:h-56 pointer-events-none z-0 opacity-85">
        <svg
          viewBox="0 0 1200 320"
          className="w-full h-full object-cover object-bottom"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Skyline Gradient */}
            <linearGradient id="skylineGradBack" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0B3056" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#08203A" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="skylineGradFront" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0E3D6E" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#06182C" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Back Layer: Distant Dubai Marina & Downtown Towers */}
          <path
            d="M0,320 L0,220 L30,220 L30,190 L50,190 L50,220 L75,220 L75,170 L95,170 L95,220 L130,220 L130,140 L160,140 L160,220 L210,220 L210,180 L235,180 L235,220 L310,220 L310,130 L345,130 L345,220 L420,220 L420,160 L450,160 L450,220 L520,220 L520,70 L540,70 L540,220 L660,220 L660,150 L690,150 L690,220 L780,220 L780,180 L810,180 L810,220 L900,220 L900,120 L935,120 L935,220 L1020,220 L1020,170 L1050,170 L1050,220 L1200,220 L1200,320 Z"
            fill="url(#skylineGradBack)"
          />

          {/* Foreground Iconic UAE Landmarks */}
          {/* 1. Dubai Frame (left-center: x ~ 230) */}
          <g opacity="0.9">
            <rect x="220" y="110" width="12" height="150" fill="#D99B26" />
            <rect x="270" y="110" width="12" height="150" fill="#D99B26" />
            <rect x="220" y="102" width="62" height="12" rx="2" fill="#F5B041" />
            <rect x="220" y="240" width="62" height="12" rx="2" fill="#B7791F" />
            <rect x="232" y="114" width="38" height="126" fill="#0D3B66" fillOpacity="0.4" />
          </g>

          {/* 2. Burj Al Arab Sail (left: x ~ 370) */}
          <g opacity="0.95">
            <rect x="395" y="60" width="6" height="200" fill="#FFFFFF" fillOpacity="0.8" />
            <path
              d="M401,80 Q450,140 440,230 L401,230 Z"
              fill="url(#skylineGradFront)"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeOpacity="0.4"
            />
            <line x1="375" y1="105" x2="400" y2="105" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
          </g>

          {/* 3. Burj Khalifa (Center landmark) */}
          <g opacity="1">
            <path d="M570,320 L582,190 L618,190 L630,320 Z" fill="url(#skylineGradFront)" />
            <path d="M584,190 L588,130 L612,130 L616,190 Z" fill="#0D3B66" />
            <path d="M590,130 L593,80 L607,80 L610,130 Z" fill="#144C82" />
            <path d="M595,80 L597,40 L603,40 L605,80 Z" fill="#205E9E" />
            <rect x="599" y="10" width="2" height="32" fill="#FFFFFF" />
            <circle cx="600" cy="8" r="3" fill="#FD9302">
              <animate attributeName="opacity" values="0.2;1;0.2" dur="1s" repeatCount="indefinite" />
            </circle>
            {/* Lit Window Strata */}
            <line x1="586" y1="180" x2="614" y2="180" stroke="#FFE082" strokeWidth="1.5" strokeOpacity="0.8" />
            <line x1="588" y1="165" x2="612" y2="165" stroke="#FFE082" strokeWidth="1.5" strokeOpacity="0.8" />
            <line x1="589" y1="150" x2="611" y2="150" stroke="#FFE082" strokeWidth="1.5" strokeOpacity="0.8" />
            <line x1="592" y1="120" x2="608" y2="120" stroke="#FFE082" strokeWidth="1.5" strokeOpacity="0.8" />
            <line x1="594" y1="100" x2="606" y2="100" stroke="#FFE082" strokeWidth="1.5" strokeOpacity="0.8" />
          </g>

          {/* 4. Museum of the Future Torus (right-center: x ~ 730) */}
          <g opacity="0.95">
            <ellipse cx="740" cy="185" rx="55" ry="35" fill="url(#skylineGradFront)" stroke="#94A3B8" strokeWidth="2.5" />
            <ellipse cx="740" cy="185" rx="28" ry="16" fill="#0A2540" />
            <path d="M710,175 Q730,165 765,172" stroke="#FFE082" strokeWidth="1.5" fill="none" strokeOpacity="0.7" />
            <path d="M705,190 Q740,205 770,195" stroke="#FFE082" strokeWidth="1.5" fill="none" strokeOpacity="0.7" />
          </g>

          {/* 5. Emirates Towers Twins (right: x ~ 870 & 920) */}
          <g opacity="0.9">
            <path d="M855,260 L855,100 L875,70 L895,100 L895,260 Z" fill="url(#skylineGradFront)" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.4" />
            <path d="M910,260 L910,120 L928,95 L945,120 L945,260 Z" fill="url(#skylineGradFront)" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.4" />
          </g>

          {/* Waterfront Base */}
          <rect x="0" y="260" width="1200" height="60" fill="#051322" />
          <line x1="380" y1="275" x2="440" y2="275" stroke="#38BDF8" strokeWidth="2" strokeOpacity="0.4" strokeDasharray="10 5" />
          <line x1="560" y1="275" x2="640" y2="275" stroke="#FFE082" strokeWidth="2.5" strokeOpacity="0.6" strokeDasharray="15 6" />
        </svg>
      </div>

      {/* Top action header: Skip Intro button */}
      <div className="w-full pt-8 px-6 flex justify-end relative z-20">
        <button
          type="button"
          onClick={dismissOpeningAnimation}
          className="text-xs font-bold text-white/90 hover:text-white px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
        >
          <span>Skip Intro</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3. CENTRAL HERO IDENTITY & "MORE FUN, MORE TOGETHER" */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 max-w-md mx-auto text-center -mt-6">
        {/* Logo Badge Animation */}
        <div className="relative transition-transform duration-700 transform scale-100 animate-in fade-in zoom-in">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white p-3.5 shadow-[0_20px_60px_rgba(0,0,0,0.4)] flex items-center justify-center border-2 border-white/90 relative">
            <SpoteraMarkSvg className="w-full h-full drop-shadow-sm" />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none" />
          </div>

          {/* Sparkle Floating Badge */}
          <div className="absolute -top-2 -right-2 bg-[#FD9302] text-white p-1.5 rounded-full shadow-md border-2 border-white animate-bounce">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
          </div>
        </div>

        {/* SpoteraDeals Brand Name */}
        <div className="mt-5 flex items-center justify-center tracking-tight leading-none">
          <span className="text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
            Spotera
          </span>
          <span className="text-3xl sm:text-4xl font-black text-[#FD9302] tracking-tight drop-shadow-md ml-1">
            Deals
          </span>
        </div>

        {/* Highlight Slogan: “More Fun, More Together” */}
        <div className="mt-3">
          <h2 className="text-xl sm:text-2xl font-black text-[#FFE082] tracking-tight drop-shadow-md">
            “More Fun, More Together”
          </h2>
        </div>

        {/* Tagline Pill */}
        <div className="mt-3 px-4 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-[11px] font-bold tracking-[0.2em] text-white uppercase shadow-xs">
          UAE Family Deals & Experiences
        </div>
      </div>

      {/* 4. Bottom Modern Pulsing Indicator */}
      <div className="relative z-10 pb-8 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0D9CFD] shadow-xs animate-pulse" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FD9302] shadow-xs animate-pulse [animation-delay:200ms]" />
          <span className="w-2.5 h-2.5 rounded-full bg-white shadow-xs animate-pulse [animation-delay:400ms]" />
        </div>
        <span className="text-[11px] text-white/80 font-medium tracking-wide">
          Entering SpoteraDeals...
        </span>
      </div>
    </div>
  );
};
