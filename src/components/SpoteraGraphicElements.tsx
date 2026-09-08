import React from 'react';

// Spotera Abstract Flowing Wave Backdrop (Sleek fluid blue curves)
export const SpoteraFlowingShapes: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 1440 380"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none pointer-events-none ${className}`}
    preserveAspectRatio="none"
  >
    <defs>
      <linearGradient id="spoteraWave1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1D6FE0" stopOpacity="0.35" />
        <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#0B3D75" stopOpacity="0.4" />
      </linearGradient>
      <linearGradient id="spoteraWave2" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#2563EB" stopOpacity="0.1" />
      </linearGradient>
      <radialGradient id="spoteraAura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#1D6FE0" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Soft Aura Glow Center */}
    <circle cx="720" cy="180" r="320" fill="url(#spoteraAura)" />

    {/* Layered Smooth Waves */}
    <path
      d="M0 320C240 260 480 360 720 300C960 240 1200 340 1440 280V380H0V320Z"
      fill="url(#spoteraWave1)"
    />
    <path
      d="M0 340C320 280 640 370 960 310C1200 270 1340 330 1440 320V380H0V340Z"
      fill="url(#spoteraWave2)"
    />
  </svg>
);

// Spotera Dynamic Discovery Badge (Modern Compass & Spark Motif)
export const SpoteraDiscoveryBadge: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none pointer-events-none ${className}`}
  >
    <circle cx="60" cy="60" r="54" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5" strokeDasharray="4 4" />
    <circle cx="60" cy="60" r="42" fill="rgba(255, 255, 255, 0.08)" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1.5" />
    
    {/* Geometric Compass Star */}
    <path
      d="M60 24L65 55L96 60L65 65L60 96L55 65L24 60L55 55L60 24Z"
      fill="url(#sparkGrad)"
      stroke="rgba(255, 255, 255, 0.8)"
      strokeWidth="1.5"
    />
    <circle cx="60" cy="60" r="4" fill="#FFFFFF" />

    {/* Sparkle Nodes */}
    <circle cx="88" cy="34" r="2.5" fill="#FDE047" />
    <circle cx="32" cy="86" r="2" fill="#38BDF8" />

    <defs>
      <linearGradient id="sparkGrad" x1="24" y1="24" x2="96" y2="96" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38BDF8" />
        <stop offset="0.5" stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#FBBF24" />
      </linearGradient>
    </defs>
  </svg>
);

// Spotera Floating Voucher / Deal Accent Pill
export const SpoteraVoucherAccent: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 160 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none pointer-events-none ${className}`}
  >
    <rect
      x="2"
      y="2"
      width="156"
      height="76"
      rx="16"
      fill="rgba(255, 255, 255, 0.12)"
      stroke="rgba(255, 255, 255, 0.3)"
      strokeWidth="1.5"
    />
    {/* Perforation Cutouts */}
    <circle cx="2" cy="40" r="8" fill="#1D6FE0" />
    <circle cx="158" cy="40" r="8" fill="#1D6FE0" />
    <line x1="50" y1="12" x2="50" y2="68" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.5" strokeDasharray="3 3" />
    
    {/* Inner Lines */}
    <rect x="62" y="24" width="70" height="8" rx="4" fill="rgba(255, 255, 255, 0.7)" />
    <rect x="62" y="38" width="45" height="6" rx="3" fill="rgba(255, 255, 255, 0.4)" />
    <circle cx="26" cy="40" r="10" fill="#FF6A55" />
    <path d="M22 40L25 43L30 37" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
