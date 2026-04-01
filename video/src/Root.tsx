import React from 'react';
import { Composition } from 'remotion';
import { B3PromoVideo } from './Video';

// Total: 450 frames = 15 seconds at 30 fps
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="B3Promo"
      component={B3PromoVideo}
      durationInFrames={450}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
