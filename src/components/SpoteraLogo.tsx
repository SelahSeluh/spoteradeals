import React, { useState } from 'react';

interface SpoteraLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'light' | 'dark' | 'colored' | 'auto';
  showTagline?: boolean;
  taglineText?: string;
  showUaeBadge?: boolean;
  withIcon?: boolean;
  iconOnly?: boolean;
  badgeShape?: 'none' | 'squircle' | 'circle';
  preferImage?: boolean;
  className?: string;
  customLogoUrl?: string;
  customSiteName?: string;
  onClick?: () => void;
}

export const SpoteraMarkSvg: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      {/* Blue Location Pin Gradient */}
      <linearGradient id="spoteraPinGrad" x1="15%" y1="10%" x2="85%" y2="90%">
        <stop offset="0%" stopColor="#00C4FF" />
        <stop offset="42%" stopColor="#0096FF" />
        <stop offset="100%" stopColor="#0062FF" />
      </linearGradient>

      {/* Orange Deal Tag Gradient */}
      <linearGradient id="spoteraTagGrad" x1="18%" y1="12%" x2="82%" y2="92%">
        <stop offset="0%" stopColor="#FFB300" />
        <stop offset="48%" stopColor="#FF8200" />
        <stop offset="100%" stopColor="#FF5200" />
      </linearGradient>

      {/* Tag Bottom Fold Gradient */}
      <linearGradient id="spoteraFoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF5500" />
        <stop offset="100%" stopColor="#D83600" />
      </linearGradient>

      {/* Smile Gradient */}
      <linearGradient id="spoteraSmileGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#00B6FE" />
        <stop offset="100%" stopColor="#0084FF" />
      </linearGradient>

      {/* Soft shadow for depth between tag and pin */}
      <filter id="spoteraTagElevation" x="-15%" y="-15%" width="130%" height="130%">
        <feDropShadow dx="-1" dy="1.4" stdDeviation="1.6" floodColor="#002266" floodOpacity="0.16" />
      </filter>
    </defs>

    {/* 1. Main Cyan-Blue Location Pin Body */}
    <path
      d="M 50.2 86.8 C 45.2 80 23.5 60.5 23.5 41.5 C 23.5 24.5 35.8 15 51.5 15 C 64.2 15 75.2 23.2 76.5 36.2 C 77.2 44.8 73.2 53.8 66.8 62.8 C 61 70.8 55.2 79.5 50.2 86.8 Z"
      fill="url(#spoteraPinGrad)"
    />

    {/* 2. White Circle in Pin Head */}
    <circle cx="47.2" cy="45.5" r="18.8" fill="#FFFFFF" />

    {/* 3. Cheerful Cyan-Blue Smile Arc */}
    <path
      d="M 37.8 48.2 C 40.5 56.2, 54 56.2, 56.8 48.2"
      fill="none"
      stroke="url(#spoteraSmileGrad)"
      strokeWidth="4.2"
      strokeLinecap="round"
    />

    {/* 4. Orange Angled Deal Tag with White Punch Hole */}
    <g filter="url(#spoteraTagElevation)">
      <path
        d="M 54.5 22.8 L 64.2 15.2 C 66.8 13.4, 70 13.8, 72.2 15.6 L 79.2 22 C 81.2 23.8, 81.5 26.8, 80.2 29.2 L 71.8 62.2 C 70.8 65.2, 67.6 66.8, 64.5 65.6 L 56.5 61 C 53.4 59.2, 52.4 56, 53.4 53 L 54.5 22.8 Z"
        fill="url(#spoteraTagGrad)"
      />
      {/* Tag Punch Hole */}
      <circle cx="68.2" cy="24.5" r="4.3" fill="#FFFFFF" />
    </g>

    {/* 5. 3D Peel / Curled Bottom Flap of Orange Tag */}
    <path
      d="M 56.5 61 C 60.8 61.5, 65.8 57.2, 66.8 49 C 63.8 53.2, 59.6 57.8, 56.5 61 Z"
      fill="url(#spoteraFoldGrad)"
    />
  </svg>
);

export const SpoteraLogo: React.FC<SpoteraLogoProps> = ({
  size = 'md',
  variant = 'light',
  showTagline = false,
  taglineText = 'UAE Family Deals & Experiences',
  showUaeBadge = false,
  withIcon = true,
  iconOnly = false,
  badgeShape = 'none',
  preferImage = false,
  className = '',
  customLogoUrl,
  customSiteName,
  onClick,
}) => {
  const [imgError, setImgError] = useState(false);

  // Size configurations
  const sizeConfig = {
    xs: { iconSize: 'w-6 h-6', textSize: 'text-base', taglineSize: 'text-[9px]', gap: 'gap-1.5' },
    sm: { iconSize: 'w-8 h-8', textSize: 'text-lg', taglineSize: 'text-[10px]', gap: 'gap-2' },
    md: { iconSize: 'w-10 h-10', textSize: 'text-xl sm:text-2xl', taglineSize: 'text-[11px]', gap: 'gap-2.5' },
    lg: { iconSize: 'w-12 h-12', textSize: 'text-2xl sm:text-3xl', taglineSize: 'text-xs', gap: 'gap-3' },
    xl: { iconSize: 'w-16 h-16', textSize: 'text-3xl sm:text-4xl', taglineSize: 'text-sm', gap: 'gap-3.5' },
    '2xl': { iconSize: 'w-20 h-20', textSize: 'text-4xl sm:text-5xl', taglineSize: 'text-base', gap: 'gap-4' },
  }[size];

  // Variant color styles
  const isDark = variant === 'dark';
  const primaryTextColor = isDark ? 'text-white' : 'text-slate-900';
  const tagColor = isDark ? 'text-slate-300' : 'text-slate-500';

  const logoSrc = customLogoUrl || '/spoteradeals-logo.png';
  const shouldRenderImage = (preferImage || Boolean(customLogoUrl)) && !imgError;

  const logoContent = (
    <div
      onClick={onClick}
      className={`inline-flex items-center ${sizeConfig.gap} ${onClick ? 'cursor-pointer select-none' : ''} ${className}`}
    >
      {/* 1. Official Icon Mark (Pin + Smile + Deal Tag) */}
      {withIcon && (
        <div
          className={`${sizeConfig.iconSize} shrink-0 relative flex items-center justify-center ${
            badgeShape === 'circle'
              ? 'rounded-full bg-white shadow-2xs p-0.5'
              : badgeShape === 'squircle'
              ? 'rounded-2xl bg-white shadow-2xs p-0.5'
              : ''
          } overflow-visible`}
        >
          {shouldRenderImage ? (
            <img
              src={logoSrc}
              alt="SpoteraDeals"
              onError={() => setImgError(true)}
              className="w-full h-full object-contain"
            />
          ) : (
            <SpoteraMarkSvg className="w-full h-full drop-shadow-xs" />
          )}
        </div>
      )}

      {/* 2. Text Brand Wordmark */}
      {!iconOnly && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-center tracking-tight">
            <span className={`${sizeConfig.textSize} font-black ${primaryTextColor}`}>
              {customSiteName ? customSiteName : 'Spotera'}
            </span>
            <span className={`${sizeConfig.textSize} font-black text-[#FD9302] ml-0.5`}>
              Deals
            </span>
            {showUaeBadge && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-md bg-blue-50 text-[#0D9CFD] font-extrabold text-[9px] uppercase border border-blue-200/60">
                UAE
              </span>
            )}
          </div>

          {showTagline && (
            <span className={`${sizeConfig.taglineSize} font-bold ${tagColor} tracking-tight mt-0.5`}>
              {taglineText}
            </span>
          )}
        </div>
      )}
    </div>
  );

  return logoContent;
};
