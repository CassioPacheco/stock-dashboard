import React from 'react';
import { TransitionSeries, linearTiming, springTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { LogoScene }   from './scenes/LogoScene';
import { TickerScene } from './scenes/TickerScene';
import { StatsScene }  from './scenes/StatsScene';
import { CtaScene }    from './scenes/CtaScene';

// Frame counts (30 fps):
//   LogoScene:   135 frames (4.5s)
//   TickerScene: 150 frames (5.0s)
//   StatsScene:  120 frames (4.0s)
//   CtaScene:     90 frames (3.0s)
//   3 transitions × 15 frames = 45 frames subtracted
//   Net total: 135 + 150 + 120 + 90 − 45 = 450 frames = 15 seconds ✓

const TRANSITION_FRAMES = 15;

export const B3PromoVideo: React.FC = () => {
  return (
    <TransitionSeries>
      {/* ── Scene 1: Logo reveal ── */}
      <TransitionSeries.Sequence durationInFrames={135}>
        <LogoScene />
      </TransitionSeries.Sequence>

      {/* Fade to Scene 2 */}
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
      />

      {/* ── Scene 2: Stock tickers ── */}
      <TransitionSeries.Sequence durationInFrames={150}>
        <TickerScene />
      </TransitionSeries.Sequence>

      {/* Slide from right to Scene 3 */}
      <TransitionSeries.Transition
        presentation={slide({ direction: 'from-right' })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION_FRAMES })}
      />

      {/* ── Scene 3: KPI stats ── */}
      <TransitionSeries.Sequence durationInFrames={120}>
        <StatsScene />
      </TransitionSeries.Sequence>

      {/* Fade to Scene 4 */}
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
      />

      {/* ── Scene 4: CTA outro ── */}
      <TransitionSeries.Sequence durationInFrames={90}>
        <CtaScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
