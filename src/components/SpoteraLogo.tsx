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

export const SpoteraMarkSvg: React.FC<{className?:string}> = ({className=''}) => <img className={className} src="/spoteradeals-logo.png" alt="SpoteraDeals official logo" style={{objectFit:'contain'}}/>;

export const SpoteraLogo: React.FC<SpoteraLogoProps> = ({
  size = 'md',
  variant = 'light',
  showTagline = false,
  taglineText = 'UAE Family Deals & Experiences',
  showUaeBadge = false,
  withIcon = true,
  iconOnly = false,
  badgeShape = 'none',
  preferImage = true,
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

  const logoSrc = '/spoteradeals-logo.png';
  const shouldRenderImage = (preferImage || Boolean(customLogoUrl)) && !imgError;

  const logoContent = (
    <div
      onClick={onClick}
      className={`sunshine-logo inline-flex items-center ${sizeConfig.gap} ${onClick ? 'cursor-pointer select-none' : ''} ${className}`}
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
