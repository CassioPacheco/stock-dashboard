import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { jetbrainsFamily, dmsansFamily } from '../fonts';
import { BG, ACCENT, TEXT, MUTED, MUTED2, SURFACE, BORDER } from '../constants';

// Scene duration: 120 frames (4s at 30fps)

const cards = [
  {
    label:    'Preço Atual',
    value:    'R$ 36,82',
    change:   '+0,42 (1,2%)',
    positive: true,
    ticker:   'PETR4',
    color:    '#60a5fa',
    delay:    0,
  },
  {
    label:    'Retorno YTD',
    value:    '+18,7%',
    change:   'desde 01/01/2025',
    positive: true,
    ticker:   'ITUB4',
    color:    '#fb923c',
    delay:    18,
  },
  {
    label:    'Vol. Negociado',
    value:    '142 M',
    change:   'ações / dia',
    positive: true,
    ticker:   'SANB11',
    color:    '#f87171',
    delay:    36,
  },
];

export const StatsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title
  const titleOpacity = interpolate(frame, [0, 22], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = interpolate(frame, [0, 22], [24, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  // Subtitle (slightly after)
  const subOpacity = interpolate(frame, [18, 40], [0, 1], { extrapolateRight: 'clamp' });

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
      {/* Ambient right glow */}
      <div
        style={{
          position: 'absolute',
          width: '50%',
          height: '60%',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse, rgba(245,158,11,0.06) 0%, transparent 70%)',
          right: '-10%',
          bottom: '0%',
          pointerEvents: 'none',
        }}
      />

      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontFamily: dmsansFamily,
          fontSize: '36px',
          fontWeight: 400,
          color: TEXT,
          letterSpacing: '-0.02em',
          marginBottom: '6px',
          textAlign: 'center',
        }}
      >
        Análise técnica em{' '}
        <span style={{ color: ACCENT, fontWeight: 500 }}>tempo real</span>
      </div>

      {/* Subtitle */}
      <div
        style={{
          opacity: subOpacity,
          fontFamily: jetbrainsFamily,
          fontSize: '13px',
          color: MUTED2,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          marginBottom: '60px',
        }}
      >
        Dados via Yahoo Finance · Jan 2025 – hoje
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'flex', gap: '24px' }}>
        {cards.map(({ label, value, change, positive, ticker, color, delay }) => {
          const cardSpring = spring({ frame: frame - delay, fps, config: { damping: 200 } });
          const cardY = interpolate(cardSpring, [0, 1], [70, 0]);
          const cardOpacity = interpolate(frame, [delay, delay + 22], [0, 1], {
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={ticker}
              style={{
                opacity: cardOpacity,
                transform: `translateY(${cardY}px)`,
                background: SURFACE,
                border: `1px solid ${BORDER}`,
                borderTop: `3px solid ${color}`,
                borderRadius: '14px',
                padding: '36px 40px',
                width: '280px',
                textAlign: 'center',
              }}
            >
              {/* Ticker label */}
              <div
                style={{
                  fontFamily: jetbrainsFamily,
                  fontSize: '12px',
                  fontWeight: 600,
                  color,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  marginBottom: '16px',
                }}
              >
                {ticker}
              </div>

              {/* Stat label */}
              <div
                style={{
                  fontFamily: jetbrainsFamily,
                  fontSize: '11px',
                  color: MUTED2,
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  marginBottom: '14px',
                }}
              >
                {label}
              </div>

              {/* Main value */}
              <div
                style={{
                  fontFamily: jetbrainsFamily,
                  fontSize: '42px',
                  fontWeight: 700,
                  color: TEXT,
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                }}
              >
                {value}
              </div>

              {/* Change / sub-label */}
              <div
                style={{
                  fontFamily: jetbrainsFamily,
                  fontSize: '13px',
                  fontWeight: 500,
                  color: positive ? '#34d399' : '#f87171',
                  marginTop: '14px',
                  letterSpacing: '0.02em',
                }}
              >
                {change}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
