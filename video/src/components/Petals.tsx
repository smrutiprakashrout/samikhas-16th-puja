import type React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { HEIGHT } from '../config';
import { rand, seg, sine } from '../lib/anim';
import { COL_W, COL_X, u } from '../theme';

type PetalsProps = {
  count?: number;
  seed: string;
  from?: number;
};

export const Petals: React.FC<PetalsProps> = ({ count = 8, seed, from = 0 }) => {
  const frame = useCurrentFrame();
  const span = HEIGHT + 400;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {Array.from({ length: count }, (_, i) => {
        const x0 = rand(`${seed}-px-${i}`);
        const y0 = rand(`${seed}-py-${i}`);
        const s0 = rand(`${seed}-ps-${i}`);
        const r0 = rand(`${seed}-pr-${i}`);
        const x = COL_X + x0 * COL_W + sine(frame, 120 + i * 11, r0 * Math.PI * 2) * u(18);
        const speed = u(0.3 + s0 * 0.35);
        const y = -200 + (((y0 * span + (frame - from) * speed) % span) + span) % span;
        const rot = r0 * 360 + frame * (0.2 + s0 * 0.3);
        const size = u(14 + s0 * 10);
        const opacity = 0.9 * seg(frame, from + i * 2, from + i * 2 + 15);
        return (
          <Img
            key={i}
            src={staticFile('svg/marigold-petal.svg')}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: size,
              height: size,
              transform: `translate(${x}px, ${y}px) rotate(${rot}deg)`,
              transformOrigin: 'center',
              opacity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
