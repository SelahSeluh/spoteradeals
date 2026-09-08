import React from 'react';
import { Sparkles } from 'lucide-react';

interface SpoteraAvatarProps {
  name: string;
  avatarUrl?: string;
  gender?: 'Male' | 'Female' | 'Family' | 'Prefer not to say';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

export const SpoteraAvatar: React.FC<SpoteraAvatarProps> = ({
  name,
  avatarUrl,
  gender = 'Family',
  size = 'md',
  className = '',
  onClick,
}) => {
  // Check if avatarUrl is a real custom uploaded photo or data URI
  const isCustomUploadedPhoto =
    avatarUrl &&
    avatarUrl.trim().length > 0 &&
    (avatarUrl.startsWith('data:image') ||
      avatarUrl.startsWith('blob:') ||
      (avatarUrl.startsWith('http') && !avatarUrl.includes('unsplash.com')));

  const dimensions = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  }[size];

  if (isCustomUploadedPhoto) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        onClick={onClick}
        className={`${dimensions} rounded-full object-cover ring-2 ring-blue-500/40 shadow-sm ${className} ${
          onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''
        }`}
      />
    );
  }

  // Faceless Avatar Colors based on preference/gender
  const themeGradients = {
    Female: {
      bg: 'from-pink-500 via-purple-600 to-indigo-600',
      hair: '#4c1d95',
      clothes: '#ec4899',
      skinTone: '#fbcfe8',
    },
    Male: {
      bg: 'from-blue-600 via-indigo-600 to-cyan-500',
      hair: '#1e3a8a',
      clothes: '#3b82f6',
      skinTone: '#bae6fd',
    },
    Family: {
      bg: 'from-amber-500 via-orange-500 to-rose-500',
      hair: '#78350f',
      clothes: '#f97316',
      skinTone: '#fde68a',
    },
    'Prefer not to say': {
      bg: 'from-slate-700 via-slate-800 to-slate-900',
      hair: '#334155',
      clothes: '#0ea5e9',
      skinTone: '#e2e8f0',
    },
  }[gender] || {
    bg: 'from-amber-500 via-orange-500 to-rose-500',
    hair: '#78350f',
    clothes: '#f97316',
    skinTone: '#fde68a',
  };

  return (
    <div
      onClick={onClick}
      className={`relative ${dimensions} rounded-full bg-gradient-to-tr ${themeGradients.bg} p-0.5 shadow-md flex items-center justify-center select-none overflow-hidden group ${className} ${
        onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''
      }`}
    >
      {/* Faceless Silhouette Vector Avatar (No eyes, no nose, no mouth) */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full rounded-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Radial Glow */}
        <circle cx="50" cy="50" r="48" fill="url(#bgGlow)" />
        <defs>
          <radialGradient id="bgGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 30) scale(50)">
            <stop stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="1" stopColor="#000000" stopOpacity="0.2" />
          </radialGradient>
        </defs>

        {/* Shoulders & Clothing Silhouette */}
        <path
          d="M20 92C20 74 33 64 50 64C67 64 80 74 80 92V100H20V92Z"
          fill={themeGradients.clothes}
          opacity="0.95"
        />

        {/* Neck */}
        <path d="M42 54H58V66H42V54Z" fill={themeGradients.skinTone} />

        {/* Smooth Faceless Head Oval (No Face Features!) */}
        <ellipse cx="50" cy="42" rx="19" ry="23" fill={themeGradients.skinTone} />

        {/* Hair / Headband Silhouette */}
        {gender === 'Female' ? (
          <path
            d="M30 42C30 25 38 18 50 18C62 18 70 25 70 42C70 48 68 56 68 62C64 62 62 52 62 44C58 38 42 38 38 44C38 52 36 62 32 62C32 56 30 48 30 42Z"
            fill={themeGradients.hair}
          />
        ) : (
          <path
            d="M31 38C31 24 39 18 50 18C61 18 69 24 69 38C69 38 65 28 50 28C35 28 31 38 31 38Z"
            fill={themeGradients.hair}
          />
        )}
      </svg>

      {/* Small Spotera Badge Overlay */}
      <span className="absolute bottom-0 right-0 p-0.5 bg-slate-950 text-cyan-300 rounded-full ring-1 ring-white">
        <Sparkles className="w-2.5 h-2.5" />
      </span>
    </div>
  );
};
