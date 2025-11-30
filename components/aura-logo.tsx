"use client"

export function AuraLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Outer glow ring */}
      <circle cx="24" cy="24" r="22" stroke="url(#outerGlow)" strokeWidth="1.5" opacity="0.6" />

      {/* Middle ring with gradient */}
      <circle cx="24" cy="24" r="18" stroke="url(#middleRing)" strokeWidth="2" />

      {/* Inner hexagon shield shape */}
      <path d="M24 6L38 14V34L24 42L10 34V14L24 6Z" fill="url(#hexFill)" stroke="url(#hexStroke)" strokeWidth="1.5" />

      {/* ZK symbol in center - stylized lock with proof marks */}
      <path
        d="M24 16C21.2 16 19 18.2 19 21V23H18C17.45 23 17 23.45 17 24V32C17 32.55 17.45 33 18 33H30C30.55 33 31 32.55 31 32V24C31 23.45 30.55 23 30 23H29V21C29 18.2 26.8 16 24 16ZM24 18C25.7 18 27 19.3 27 21V23H21V21C21 19.3 22.3 18 24 18Z"
        fill="url(#lockFill)"
      />

      {/* Proof verification marks */}
      <circle cx="24" cy="27" r="2" fill="#10B981" />
      <path
        d="M22.5 27L23.5 28L25.5 26"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Radiating lines for "aura" effect */}
      <line x1="24" y1="2" x2="24" y2="5" stroke="url(#rayGradient)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="43" x2="24" y2="46" stroke="url(#rayGradient)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="2" y1="24" x2="5" y2="24" stroke="url(#rayGradient)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="43" y1="24" x2="46" y2="24" stroke="url(#rayGradient)" strokeWidth="1.5" strokeLinecap="round" />

      {/* Diagonal rays */}
      <line
        x1="8.4"
        y1="8.4"
        x2="10.5"
        y2="10.5"
        stroke="url(#rayGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      <line
        x1="37.5"
        y1="37.5"
        x2="39.6"
        y2="39.6"
        stroke="url(#rayGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      <line
        x1="39.6"
        y1="8.4"
        x2="37.5"
        y2="10.5"
        stroke="url(#rayGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      <line
        x1="10.5"
        y1="37.5"
        x2="8.4"
        y2="39.6"
        stroke="url(#rayGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />

      <defs>
        <linearGradient id="outerGlow" x1="2" y1="24" x2="46" y2="24">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>

        <linearGradient id="middleRing" x1="6" y1="24" x2="42" y2="24">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>

        <linearGradient id="hexFill" x1="10" y1="6" x2="38" y2="42">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>

        <linearGradient id="hexStroke" x1="10" y1="6" x2="38" y2="42">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>

        <linearGradient id="lockFill" x1="17" y1="16" x2="31" y2="33">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>

        <linearGradient id="rayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function AuraLogoAnimated({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Animated glow behind */}
      <div className="absolute inset-0 blur-xl opacity-50 animate-pulse">
        <div className="w-full h-full rounded-full bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500" />
      </div>
      <AuraLogo className="relative z-10 w-full h-full" />
    </div>
  )
}
