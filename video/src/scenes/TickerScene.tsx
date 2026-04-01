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

// Scene duration: 150 frames (5s at 30fps)

const stocks = [
  { ticker: 'PETR4',  name: 'Petrobras',         color: '#60a5fa', price: 'R$ 36,82', ytd: '+12,4%', positive: true,  delay: 10 },
  { ticker: 'ITUB4',  name: 'Itaú Unibanco',      color: '#fb923c', price: 'R$ 35,15', ytd: '+18,7%', positive: true,  delay: 30 },
  { ticker: 'SANB11', name: 'Santander Brasil',   color: '#f87171', price: 'R$ 14,20', ytd:  '-4,2%', positive: false, delay: 50 },
];

export const TickerScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Section label slides down
  const labelOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' });
  const labelY = interpolate(frame, [0, 18], [-16, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
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
      {/* Ambient left glow */}
      <div
        style={{
          position: 'absolute',
          width: '40%',
          height: '80%',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse, rgba(245,158,11,0.05) 0%, transparent 70%)',
          left: '-10%',
          top: '10%',
          pointerEvents: 'none',
        }}
      />

      {/* Section label */}
      <div
        style={{
          opacity: labelOpacity,
          transform: `translateY(${labelY}px)`,
          fontFamily: jetbrainsFamily,
          fontSize: '13px',
          fontWeight: 500,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: MUTED2,
          marginBottom: '52px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: '20px',
            height: '2px',
            backgroundColor: ACCENT,
          }}
        />
        Ações em Destaque
      </div>

      {/* Stock rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '820px' }}>
        {stocks.map(({ ticker, name, color, price, ytd, positive, delay }) => {
          const rowSpring = spring({ frame: frame - delay, fps, config: { damping: 200 } });
          const rowX = interpolate(rowSpring, [0, 1], [-100, 0]);
          const rowOpacity = interpolate(frame, [delay, delay + 22], [0, 1], {
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={ticker}
              style={{
                opacity: rowOpacity,
                transform: `translateX(${rowX}px)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: SURFACE,
                border: `1px solid ${BORDER}`,
                borderLeft: `4px solid ${color}`,
                borderRadius: '14px',
                padding: '22px 32px',
              }}
            >
              {/* Left: dot + ticker + name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: color,
                    flexShrink: 0,
                    boxShadow: `0 0 18px ${color}99`,
                  }}
                />
                <div>
                  <div
                    style={{
                      fontFamily: jetbrainsFamily,
                      fontSize: '30px',
                      fontWeight: 700,
                      color: TEXT,
                      letterSpacing: '-0.02em',
                      lineHeight: 1,
                    }}
                  >
                    {ticker}
                  </div>
                  <div
                    style={{
                      fontFamily: dmsansFamily,
                      fontSize: '15px',
                      color: MUTED,
                      fontWeight: 300,
                      marginTop: '5px',
                    }}
                  >
                    {name}
                  </div>
                </div>
              </div>

              {/* Right: price + ytd */}
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontFamily: jetbrainsFamily,
                    fontSize: '28px',
                    fontWeight: 600,
                    color: TEXT,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {price}
                </div>
                <div
                  style={{
                    fontFamily: jetbrainsFamily,
                    fontSize: '14px',
                    fontWeight: 600,
                    color: positive ? '#34d399' : '#f87171',
                    marginTop: '5px',
                    letterSpacing: '0.03em',
                  }}
                >
                  YTD {ytd}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom label */}
      <div
        style={{
          opacity: interpolate(frame, [80, 105], [0, 1], { extrapolateRight: 'clamp' }),
          fontFamily: jetbrainsFamily,
          fontSize: '12px',
          color: MUTED2,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          marginTop: '44px',
        }}
      >
        B3 · Bolsa de Valores do Brasil · Yahoo Finance
      </div>
    </div>
  );
};
