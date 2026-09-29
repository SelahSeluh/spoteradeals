import React, { useEffect, useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { IntroAnimationConfig } from '../types';
import { SpoteraMarkSvg } from './SpoteraLogo';

interface OpeningAnimationProps {
  previewConfig?: IntroAnimationConfig;
  onPreviewClose?: () => void;
}

export const OpeningAnimation: React.FC<OpeningAnimationProps> = ({ previewConfig, onPreviewClose }) => {
  const { showOpeningAnimation, dismissOpeningAnimation, introConfig: contextConfig, language, startupPhase } = useApp();
  
  // Use previewConfig if passed (e.g. inside Admin preview mode), otherwise use contextConfig
  const config = previewConfig || contextConfig;

  const isVisible = Boolean(previewConfig || showOpeningAnimation || startupPhase === 'intro');

  const [isFadingOut, setIsFadingOut] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isVideoMuted, setIsVideoMuted] = useState(config.videoMuted ?? true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const onCloseRef = useRef<() => void>(() => {});
  useEffect(() => {
    onCloseRef.current = previewConfig && onPreviewClose ? onPreviewClose : dismissOpeningAnimation;
  }, [previewConfig, onPreviewClose, dismissOpeningAnimation]);

  // Ensure video attempts to play smoothly on mount
  useEffect(() => {
    if (isVisible && config.backgroundType === 'video' && videoRef.current) {
      videoRef.current.muted = isVideoMuted;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          // In some browsers or iframe sandboxes, autoplay requires user gesture or strict mute
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsVideoMuted(true);
            videoRef.current.play().catch(() => {});
          }
        });
      }
    }
  }, [isVisible, config.backgroundType, isVideoMuted]);

  const effectiveDurationSeconds =
    config && typeof config.durationSeconds === 'number' && config.durationSeconds >= 1
      ? config.durationSeconds
      : 4.5;
  const durationMs = Math.max(1500, Math.round(effectiveDurationSeconds * 1000));
  const fadeOutLeadTimeMs = 400;

  // Determine localized slogan text based on active language or fallbacks
  const displaySlogan = (() => {
    if (language === 'ar' && config.textAr) return config.textAr;
    if (language === 'fr' && config.textFr) return config.textFr;
    if (language === 'ru' && config.textRu) return config.textRu;
    return config.text || 'More fun, more together.';
  })();

  // Dismiss timer logic - stable execution
  useEffect(() => {
    if (!isVisible) return;

    setIsFadingOut(false);
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, Math.max(300, durationMs - fadeOutLeadTimeMs));

    const dismissTimer = setTimeout(() => {
      onCloseRef.current?.();
    }, durationMs);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(dismissTimer);
    };
  }, [isVisible, durationMs]);

  // Slideshow interval timer
  useEffect(() => {
    if (config.backgroundType !== 'slideshow' || !config.slideshowImages || config.slideshowImages.length <= 1) {
      return;
    }
    const intervalMs = Math.max(800, (config.slideshowIntervalSeconds || 1.5) * 1000);
    const slideTimer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % config.slideshowImages.length);
    }, intervalMs);

    return () => clearInterval(slideTimer);
  }, [config.backgroundType, config.slideshowImages, config.slideshowIntervalSeconds]);

  if (!isVisible) return null;

  const handleManualSkip = () => {
    onCloseRef.current?.();
  };

  // Logo sizing classes
  const logoSizeClasses = {
    small: 'w-16 h-16 sm:w-20 sm:h-20',
    medium: 'w-24 h-24 sm:w-28 sm:h-28',
    large: 'w-32 h-32 sm:w-36 sm:h-36',
    xlarge: 'w-40 h-40 sm:w-48 sm:h-48',
  }[config.logoSize || 'medium'];

  // Text sizing classes
  const textSizeClasses = {
    small: 'text-base sm:text-lg',
    medium: 'text-xl sm:text-2xl',
    large: 'text-2xl sm:text-3xl',
    xlarge: 'text-3xl sm:text-4xl',
  }[config.textSize || 'medium'];

  // Animation style classes for the central block
  const animationStyleClasses = {
    'fade-in': 'animate-in fade-in duration-700',
    'scale-in': 'animate-in fade-in zoom-in-75 duration-700',
    'slide-up': 'animate-in fade-in slide-in-from-bottom-8 duration-700',
    'logo-reveal': 'animate-in fade-in zoom-in-95 duration-1000',
    'smooth-combined': 'animate-in fade-in zoom-in-90 slide-in-from-bottom-4 duration-700',
  }[config.animationStyle || 'smooth-combined'];

  // Text animation style classes
  const textAnimationClasses = {
    'fade-in': 'animate-in fade-in duration-500',
    'slide-up': 'animate-in fade-in slide-in-from-bottom-3 duration-500',
    'typewriter': 'tracking-wider font-extrabold',
    'glow-pulse': 'animate-pulse font-extrabold',
  }[config.textAnimationStyle || 'fade-in'];

  // Alignment classes
  const textAlignmentClasses = {
    center: 'text-center items-center justify-center',
    left: 'text-left items-start justify-start',
    right: 'text-right items-end justify-end',
  }[config.textAlignment || 'center'];

  // Solid Gradient Styles
  const solidGrad = config.solidGradient || {
    from: '#0A2540',
    via: '#0E3D6E',
    to: '#125492',
    accent: '#FD9302',
    showSkyline: true,
  };

  const solidBackgroundStyle = {
    backgroundImage: `linear-gradient(to bottom, ${solidGrad.from || '#0A2540'}, ${solidGrad.via || '#0E3D6E'}, ${solidGrad.to || '#125492'})`,
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-between overflow-hidden select-none text-white transition-opacity duration-500 ease-in-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={config.backgroundType === 'solid' ? solidBackgroundStyle : undefined}
    >
      {/* 1. BACKGROUND LAYERS ACCORDING TO CONFIG */}

      {/* Case A: Solid background with UAE skyline vector */}
      {config.backgroundType === 'solid' && (
        <>
          <div className="absolute inset-0 pointer-events-none">
            {/* Horizon Glow */}
            <div
              className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full blur-3xl"
              style={{
                background: `radial-gradient(ellipse at center, ${solidGrad.accent || '#FD9302'}40 0%, #0D9CFD25 45%, transparent 70%)`,
              }}
            />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-white/10 rounded-full blur-3xl" />

            {/* Twinkling ambient stars */}
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

          {/* UAE Skyline Vector (can be toggled) */}
          {solidGrad.showSkyline !== false && (
            <div className="absolute bottom-0 inset-x-0 h-44 sm:h-56 pointer-events-none z-0 opacity-85">
              <svg
                viewBox="0 0 1200 320"
                className="w-full h-full object-cover object-bottom"
                preserveAspectRatio="none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="skylineGradBack" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0B3056" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#08203A" stopOpacity="0.95" />
                  </linearGradient>
                  <linearGradient id="skylineGradFront" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0E3D6E" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#06182C" stopOpacity="1" />
                  </linearGradient>
                </defs>

                <path
                  d="M0,320 L0,220 L30,220 L30,190 L50,190 L50,220 L75,220 L75,170 L95,170 L95,220 L130,220 L130,140 L160,140 L160,220 L210,220 L210,180 L235,180 L235,220 L310,220 L310,130 L345,130 L345,220 L420,220 L420,160 L450,160 L450,220 L520,220 L520,70 L540,70 L540,220 L660,220 L660,150 L690,150 L690,220 L780,220 L780,180 L810,180 L810,220 L900,220 L900,120 L935,120 L935,220 L1020,220 L1020,170 L1050,170 L1050,220 L1200,220 L1200,320 Z"
                  fill="url(#skylineGradBack)"
                />

                {/* Landmarks */}
                <g opacity="0.9">
                  <rect x="220" y="110" width="12" height="150" fill="#D99B26" />
                  <rect x="270" y="110" width="12" height="150" fill="#D99B26" />
                  <rect x="220" y="102" width="62" height="12" rx="2" fill="#F5B041" />
                  <rect x="220" y="240" width="62" height="12" rx="2" fill="#B7791F" />
                  <rect x="232" y="114" width="38" height="126" fill="#0D3B66" fillOpacity="0.4" />
                </g>

                <g opacity="0.95">
                  <rect x="395" y="60" width="6" height="200" fill="#FFFFFF" fillOpacity="0.8" />
                  <path d="M401,80 Q450,140 440,230 L401,230 Z" fill="url(#skylineGradFront)" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.4" />
                  <line x1="375" y1="105" x2="400" y2="105" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
                </g>

                <g opacity="1">
                  <path d="M570,320 L582,190 L618,190 L630,320 Z" fill="url(#skylineGradFront)" />
                  <path d="M584,190 L588,130 L612,130 L616,190 Z" fill="#0D3B66" />
                  <path d="M590,130 L593,80 L607,80 L610,130 Z" fill="#144C82" />
                  <path d="M595,80 L597,40 L603,40 L605,80 Z" fill="#205E9E" />
                  <rect x="599" y="10" width="2" height="32" fill="#FFFFFF" />
                  <circle cx="600" cy="8" r="3" fill="#FD9302">
                    <animate attributeName="opacity" values="0.2;1;0.2" dur="1s" repeatCount="indefinite" />
                  </circle>
                  <line x1="586" y1="180" x2="614" y2="180" stroke="#FFE082" strokeWidth="1.5" strokeOpacity="0.8" />
                  <line x1="588" y1="165" x2="612" y2="165" stroke="#FFE082" strokeWidth="1.5" strokeOpacity="0.8" />
                  <line x1="589" y1="150" x2="611" y2="150" stroke="#FFE082" strokeWidth="1.5" strokeOpacity="0.8" />
                  <line x1="592" y1="120" x2="608" y2="120" stroke="#FFE082" strokeWidth="1.5" strokeOpacity="0.8" />
                  <line x1="594" y1="100" x2="606" y2="100" stroke="#FFE082" strokeWidth="1.5" strokeOpacity="0.8" />
                </g>

                <g opacity="0.95">
                  <ellipse cx="740" cy="185" rx="55" ry="35" fill="url(#skylineGradFront)" stroke="#94A3B8" strokeWidth="2.5" />
                  <ellipse cx="740" cy="185" rx="28" ry="16" fill="#0A2540" />
                  <path d="M710,175 Q730,165 765,172" stroke="#FFE082" strokeWidth="1.5" fill="none" strokeOpacity="0.7" />
                  <path d="M705,190 Q740,205 770,195" stroke="#FFE082" strokeWidth="1.5" fill="none" strokeOpacity="0.7" />
                </g>

                <rect x="0" y="260" width="1200" height="60" fill="#051322" />
              </svg>
            </div>
          )}
        </>
      )}

      {/* Case B: Single Image Background */}
      {config.backgroundType === 'image' && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <img
            src={config.backgroundImageUrl || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1920'}
            alt="Dubai UAE Skyline Background"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
          />
          {/* Refined Spotera Deals Brand Overlays: Ensures optimal legibility on all devices */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at 50% 45%, rgba(13,156,253,0.18) 0%, rgba(10,37,64,0.78) 60%, rgba(5,19,34,0.95) 100%)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540] via-black/25 to-[#0A2540]/70" />
        </div>
      )}

      {/* Case C: Slideshow Background */}
      {config.backgroundType === 'slideshow' && config.slideshowImages && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {config.slideshowImages.map((imgUrl, idx) => {
            const isActive = idx === currentSlideIndex;
            return (
              <div
                key={idx}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  isActive ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
                }`}
              >
                <img src={imgUrl} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover object-center" />
              </div>
            );
          })}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/90 via-[#0A2540]/55 to-[#0A2540]/75" />
        </div>
      )}

      {/* Case D: Video Background */}
      {config.backgroundType === 'video' && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#0A2540]">
          <video
            ref={videoRef}
            src={config.videoUrl || '/spotera-intro.mp4'}
            autoPlay
            playsInline
            preload="auto"
            muted={isVideoMuted}
            loop={config.videoLoop ?? true}
            onEnded={() => {
              if (config.videoLoop === false) {
                handleManualSkip();
              }
            }}
            className="w-full h-full object-cover"
            onError={() => {
              // Gracefully fall back to local asset if external URL fails
              if (videoRef.current && !videoRef.current.src.endsWith('/spotera-intro.mp4')) {
                videoRef.current.src = '/spotera-intro.mp4';
                videoRef.current.play().catch(() => {});
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/60" />
        </div>
      )}

      {/* Top Header Controls: Sound toggle (if video) + Skip Intro button */}
      <div className="w-full pt-8 px-6 flex items-center justify-between relative z-20">
        <div>
          {config.backgroundType === 'video' && (
            <button
              type="button"
              onClick={() => {
                const next = !isVideoMuted;
                setIsVideoMuted(next);
                if (videoRef.current) {
                  videoRef.current.muted = next;
                }
              }}
              className="text-xs font-bold text-white/90 hover:text-white px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer shadow-sm pointer-events-auto"
              title={isVideoMuted ? 'Unmute' : 'Mute'}
            >
              {isVideoMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isVideoMuted ? 'Muted' : 'Sound On'}</span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleManualSkip}
          className="text-xs font-black text-white hover:text-white px-4 py-2 rounded-full bg-gradient-to-r from-[#0C5CAB] to-[#0D9CFD] hover:from-blue-700 hover:to-blue-600 border border-white/40 shadow-lg backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 pointer-events-auto ring-2 ring-white/20"
          aria-label="Skip intro animation and explore deals"
        >
          <span>{previewConfig ? 'Skip Preview' : 'Skip Intro & Explore Deals'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. CENTRAL HERO IDENTITY & LOGO + TEXT */}
      <div
        className={`relative z-10 flex flex-col px-4 max-w-lg mx-auto ${textAlignmentClasses} ${animationStyleClasses} ${
          config.logoPosition === 'top'
            ? 'mt-4'
            : config.logoPosition === 'upper-third'
            ? '-mt-16'
            : '-mt-6'
        }`}
      >
        {/* Logo Badge Animation */}
        <div className="relative transition-transform duration-700 transform">
          <div
            className={`${logoSizeClasses} rounded-3xl bg-white p-3 shadow-[0_20px_60px_rgba(0,0,0,0.4)] flex items-center justify-center border-2 border-white/90 relative overflow-hidden`}
          >
            {config.logoUrl && config.logoUrl !== '/spoteradeals-logo.png' ? (
              <img
                src={config.logoUrl}
                alt="Spotera Deals"
                className="w-full h-full object-contain drop-shadow-xs"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <SpoteraMarkSvg className="w-full h-full drop-shadow-sm" />
            )}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none" />
          </div>

          {/* Sparkle Floating Badge */}
          <div
            className="absolute -top-2 -right-2 text-white p-1.5 rounded-full shadow-md border-2 border-white animate-bounce"
            style={{ backgroundColor: config.accentColor || '#FD9302' }}
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
          </div>
        </div>

        {/* SpoteraDeals Brand Title */}
        <div className="mt-5 flex items-center justify-center tracking-tight leading-none">
          <span className="text-3xl sm:text-5xl font-black text-white tracking-wider drop-shadow-md">
            SPOTERA
          </span>
          <span
            className="text-3xl sm:text-5xl font-black tracking-wider drop-shadow-md ml-2"
            style={{ color: config.accentColor || '#FD9302' }}
          >
            DEALS
          </span>
        </div>

        {/* Dynamic Slogan Text with Custom Font / Weight / Style */}
        {config.textPosition !== 'bottom' && (
          <div className={`mt-3 ${textAnimationClasses}`}>
            <h2
              className={`${textSizeClasses} tracking-tight drop-shadow-md`}
              style={{
                color: config.textColor || '#FFE082',
                fontFamily: config.fontFamily
                  ? `${config.fontFamily}, 'Plus Jakarta Sans', sans-serif`
                  : undefined,
                fontWeight: config.fontWeight === 'extrabold' ? 800 : config.fontWeight === 'bold' ? 700 : config.fontWeight === 'medium' ? 500 : 900,
                fontStyle: config.fontStyle || 'normal',
                ...(config.fontSizeCustom ? { fontSize: `${config.fontSizeCustom}px` } : {}),
              }}
            >
              “{displaySlogan}”
            </h2>
          </div>
        )}

        {/* Subtitle / Tagline Pill */}
        <div className="mt-3 px-4 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-[11px] font-bold tracking-[0.2em] text-white uppercase shadow-xs">
          UAE Family Deals & Experiences
        </div>
      </div>

      {/* 3. Bottom Indicator or Bottom Text */}
      <div className="relative z-10 pb-8 flex flex-col items-center gap-2">
        {config.textPosition === 'bottom' && (
          <div className={`mb-2 ${textAnimationClasses}`}>
            <h2
              className={`${textSizeClasses} tracking-tight drop-shadow-md`}
              style={{
                color: config.textColor || '#FFE082',
                fontFamily: config.fontFamily
                  ? `${config.fontFamily}, 'Plus Jakarta Sans', sans-serif`
                  : undefined,
                fontWeight: config.fontWeight === 'extrabold' ? 800 : config.fontWeight === 'bold' ? 700 : config.fontWeight === 'medium' ? 500 : 900,
                fontStyle: config.fontStyle || 'normal',
                ...(config.fontSizeCustom ? { fontSize: `${config.fontSizeCustom}px` } : {}),
              }}
            >
              “{displaySlogan}”
            </h2>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0D9CFD] shadow-xs animate-pulse" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FD9302] shadow-xs animate-pulse [animation-delay:200ms]" />
          <span className="w-2.5 h-2.5 rounded-full bg-white shadow-xs animate-pulse [animation-delay:400ms]" />
        </div>
        <button
          type="button"
          onClick={handleManualSkip}
          className="mt-1 px-5 py-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5 pointer-events-auto"
        >
          <span>Tap to Enter SpoteraDeals Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
