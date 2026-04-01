import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { playfairFamily, jetbrainsFamily, dmsansFamily } from '../fonts';
import { BG, ACCENT, TEXT, MUTED, MUTED2 } from '../constants';

// Scene duration: 90 frames (3s at 30fps)

export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo scales in with spring
  const logoSpring = spring({ frame, fps, config: { damping: 200 } });
  const logoScale = interpolate(logoSpring, [0, 1], [0.75, 1]);
  const logoOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' });

  // Title fades up
  const titleSpring = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const titleY = interpolate(titleSpring, [0, 1], [24, 0]);
  const titleOpacity = interpolate(frame, [18, 40], [0, 1], { extrapolateRight: 'clamp' });

  // Tickers appear
  const tickerOpacity = interpolate(frame, [35, 55], [0, 1], { extrapolateRight: 'clamp' });

  // Amber line expands from center
  const lineProgress = interpolate(frame, [45, 72], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  // Final tagline
  const tagOpacity = interpolate(frame, [62, 80], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: BG,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow — centered, larger */}
      <div
        style={{
          position: 'absolute',
          width: '70%',
          height: '70%',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse, rgba(245,158,11,0.10) 0%, transparent 65%)',
          top: '15%',
          left: '15%',
          pointerEvents: 'none',
        }}
      />

      {/* Top amber accent bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: `linear-gradient(to right, transparent, ${ACCENT}, transparent)`,
          opacity: logoOpacity,
        }}
      />

      {/* B3 Logotype */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          fontFamily: playfairFamily,
          fontSize: '160px',
          fontWeight: 900,
          color: ACCENT,
          lineHeight: 0.82,
          letterSpacing: '-0.03em',
          textShadow: '0 0 100px rgba(245,158,11,0.32)',
          textAlign: 'center',
        }}
      >
        B3
      </div>

      {/* Main title */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          textAlign: 'center',
          marginTop: '36px',
        }}
      >
        <div
          style={{
            fontFamily: dmsansFamily,
            fontSize: '32px',
            fontWeight: 400,
            color: TEXT,
            letterSpacing: '-0.01em',
          }}
        >
          Dashboard de Ações Brasileiras
        </div>
      </div>

      {/* Ticker row */}
      <div
        style={{
          opacity: tickerOpacity,
          display: 'flex',
          gap: '24px',
          marginTop: '24px',
          fontFamily: jetbrainsFamily,
          fontSize: '16px',
          fontWeight: 700,
          letterSpacing: '0.14em',
        }}
      >
        {[
          { label: 'PETR4',  color: '#60a5fa' },
          { label: '·',      color: MUTED2    },
          { label: 'ITUB4',  color: '#fb923c' },
          { label: '·',      color: MUTED2    },
          { label: 'SANB11', color: '#f87171' },
        ].map(({ label, color }, i) => (
          <span key={i} style={{ color }}>
            {label}
          </span>
        ))}
      </div>

      {/* Amber expanding line */}
      <div
        style={{
          marginTop: '52px',
          width: `${lineProgress * 320}px`,
          height: '2px',
          backgroundColor: ACCENT,
          opacity: 0.65,
        }}
      />

      {/* Final tagline */}
      <div
        style={{
          opacity: tagOpacity,
          fontFamily: jetbrainsFamily,
          fontSize: '13px',
          color: MUTED2,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          marginTop: '20px',
        }}
      >
        Dados via Yahoo Finance · Uso educacional
      </div>
    </div>
  );
};
