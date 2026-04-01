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

// Scene duration: 135 frames (4.5s at 30fps)
export const LogoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Amber lines draw across from sides (0 → 20 frames)
  const lineScale = interpolate(frame, [0, 22], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  // "B3" springs up into view (starts at frame 8)
  const logoSpring = spring({ frame: frame - 8, fps, config: { damping: 200 } });
  const logoY = interpolate(logoSpring, [0, 1], [90, 0]);
  const logoOpacity = interpolate(frame, [8, 30], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  // "BOLSA · BRASIL · BALCÃO" fades in (frame 40)
  const subtitleOpacity = interpolate(frame, [40, 65], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // "Dashboard de Ações Brasileiras" slides up (frame 70)
  const titleSpring = spring({ frame: frame - 70, fps, config: { damping: 200 } });
  const titleY = interpolate(titleSpring, [0, 1], [28, 0]);
  const titleOpacity = interpolate(frame, [70, 95], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Small decorative row below title (frame 95)
  const dotOpacity = interpolate(frame, [95, 115], [0, 1], {
    extrapolateRight: 'clamp',
  });

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
      {/* Ambient amber glow */}
      <div
        style={{
          position: 'absolute',
          width: '65%',
          height: '65%',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse, rgba(245,158,11,0.09) 0%, transparent 70%)',
          top: '17%',
          left: '17%',
          pointerEvents: 'none',
        }}
      />

      {/* Top amber line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '3px',
          backgroundColor: ACCENT,
          transformOrigin: 'left center',
          transform: `scaleX(${lineScale})`,
        }}
      />

      {/* B3 Logotype */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `translateY(${logoY}px)`,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: playfairFamily,
            fontSize: '240px',
            fontWeight: 900,
            color: ACCENT,
            lineHeight: 0.82,
            letterSpacing: '-0.03em',
            textShadow: '0 0 140px rgba(245,158,11,0.30)',
          }}
        >
          B3
        </div>
      </div>

      {/* Subtitle: Bolsa · Brasil · Balcão */}
      <div
        style={{
          opacity: subtitleOpacity,
          fontFamily: jetbrainsFamily,
          fontSize: '20px',
          fontWeight: 500,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: MUTED2,
          marginTop: '28px',
        }}
      >
        BOLSA &nbsp;·&nbsp; BRASIL &nbsp;·&nbsp; BALCÃO
      </div>

      {/* Main title */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontFamily: dmsansFamily,
          fontSize: '38px',
          fontWeight: 400,
          color: TEXT,
          marginTop: '44px',
          letterSpacing: '-0.01em',
        }}
      >
        Dashboard de Ações Brasileiras
      </div>

      {/* Decorative ticker row */}
      <div
        style={{
          opacity: dotOpacity,
          display: 'flex',
          gap: '32px',
          marginTop: '40px',
          fontFamily: jetbrainsFamily,
          fontSize: '15px',
          fontWeight: 600,
          letterSpacing: '0.12em',
          color: MUTED,
        }}
      >
        {[
          { label: 'PETR4', color: '#60a5fa' },
          { label: 'ITUB4', color: '#fb923c' },
          { label: 'SANB11', color: '#f87171' },
        ].map(({ label, color }) => (
          <span key={label} style={{ color }}>
            {label}
          </span>
        ))}
      </div>

      {/* Bottom amber line */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '3px',
          backgroundColor: ACCENT,
          transformOrigin: 'right center',
          transform: `scaleX(${lineScale})`,
        }}
      />
    </div>
  );
};
