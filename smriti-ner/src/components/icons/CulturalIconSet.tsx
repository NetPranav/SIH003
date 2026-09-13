// ── SMRITI-NER CULTURAL SVG ICONOGRAPHY LIBRARY ─────────────────────────────
// Sub-Phase 2.1 Deliverable: High-contrast, culturally intuitive vector icons for dementia care

import React from "react";

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

// 1. Ancestral Hearth & Home Icon (Village cottage)
export function HearthHomeIcon({ size = 32, color = "currentColor", style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style}>
      <path
        d="M4 14L16 4L28 14V26C28 27.1 27.1 28 26 28H6C4.9 28 4 27.1 4 26V14Z"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 28V16H20V28" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M22 6V10" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// 2. Dhol Drum Icon (Rhythm Game)
export function DholGameIcon({ size = 32, color = "currentColor", style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style}>
      <ellipse cx="16" cy="9" rx="11" ry="5" stroke={color} strokeWidth="2.5" />
      <path d="M5 9V23C5 25.76 9.92 28 16 28C22.08 28 27 25.76 27 23V9" stroke={color} strokeWidth="2.5" />
      <path d="M8 12L24 20M24 12L8 20" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M25 4L28 7" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// 3. Pepa Horn Icon (Traditional Music)
export function PepaMusicIcon({ size = 32, color = "currentColor", style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style}>
      <path
        d="M5 25C9 25 15 23 20 18C24 14 27 10 27 6M27 6C23 6 18 8 13 13C8 18 5 22 5 25Z"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse cx="25" cy="8" rx="3" ry="2" transform="rotate(-30 25 8)" stroke={color} strokeWidth="2" />
      <path d="M8 22L12 26" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// 4. Weaver's Loom Shuttle Icon
export function LoomWeaveIcon({ size = 32, color = "currentColor", style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style}>
      <rect x="5" y="5" width="22" height="22" rx="3" stroke={color} strokeWidth="2.5" />
      <path d="M10 5V27M16 5V27M22 5V27" stroke={color} strokeWidth="2" strokeDasharray="3 3" />
      <path d="M3 16H29" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="16" cy="16" r="3" fill={color} />
    </svg>
  );
}

// 5. Indigenous Fauna / Deer Icon (Kaziranga & Sangai)
export function FaunaDeerIcon({ size = 32, color = "currentColor", style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style}>
      <path
        d="M16 12C12 12 9 15 9 19C9 23 12 27 16 27C20 27 23 23 23 19C23 15 20 12 16 12Z"
        stroke={color}
        strokeWidth="2.5"
      />
      <path d="M10 13L5 6M8 8L5 10" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M22 13L27 6M24 8L27 10" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="13" cy="18" r="1.5" fill={color} />
      <circle cx="19" cy="18" r="1.5" fill={color} />
      <path d="M14.5 22C15 22.5 17 22.5 17.5 22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// 6. Traditional Mortar & Pestle Icon (Medicine Reminders)
export function MedicineMortarIcon({ size = 32, color = "currentColor", style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style}>
      <path
        d="M5 14C5 21 9 26 16 26C23 26 27 21 27 14H5Z"
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M4 14H28" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M23 5L13 18" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <path d="M11 26H21" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// 7. Lotus Blossom & Connection Icon (Family / Legacy)
export function LotusConnectIcon({ size = 32, color = "currentColor", style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style}>
      <path
        d="M16 6C16 12 13 18 7 20C11 23 15 24 16 24C17 24 21 23 25 20C19 18 16 12 16 6Z"
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M16 14C12 15 9 18 8 22C12 24 15 25 16 25C17 25 20 24 24 22C23 18 20 15 16 14Z"
        stroke={color}
        strokeWidth="2"
      />
      <path d="M5 25C11 27 21 27 27 25" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// 8. Sacred Banyan Tree Icon (Memory Album & Roots)
export function SacredBanyanIcon({ size = 32, color = "currentColor", style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style}>
      <path
        d="M16 6C11 6 7 10 7 15C7 18 9 20 11 21C11 24 13 27 16 27C19 27 21 24 21 21C23 20 25 18 25 15C25 10 21 6 16 6Z"
        stroke={color}
        strokeWidth="2.5"
      />
      <path d="M16 16V27M13 23V27M19 23V27" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M10 27H22" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// 9. Clinician & Caregiver Shield Icon
export function ClinicianShieldIcon({ size = 32, color = "currentColor", style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style}>
      <path
        d="M16 4L6 8V16C6 22.5 10.3 26.5 16 28C21.7 26.5 26 22.5 26 16V8L16 4Z"
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M16 11V21M11 16H21" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// 10. Water Ripple Grounding Icon (Anti-Agitation)
export function GroundingWaterIcon({ size = 32, color = "currentColor", style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style}>
      <path
        d="M16 4C16 4 9 14 9 19C9 22.87 12.13 26 16 26C19.87 26 23 22.87 23 19C23 14 16 4 16 4Z"
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M13 20C13.5 21.5 15 22.5 16.5 22.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// 11. Dawn Sun Icon (Morning Routine)
export function SunMorningIcon({ size = 32, color = "currentColor", style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style}>
      <circle cx="16" cy="16" r="6" stroke={color} strokeWidth="2.5" />
      <path d="M16 3V6M16 26V29M3 16H6M26 16H29M6.8 6.8L8.9 8.9M23.1 23.1L25.2 25.2M6.8 25.2L8.9 23.1M23.1 8.9L25.2 6.8" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// 12. Calm Moon Icon (Night Rest)
export function MoonNightIcon({ size = 32, color = "currentColor", style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style}>
      <path
        d="M24 18C23.5 23 19 27 14 27C8.5 27 4 22.5 4 17C4 12 8 7.5 13 7C12 9 11.5 11.5 12 14C12.8 18 16 21.2 20 22C21.3 22.2 22.7 21.7 24 18Z"
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
