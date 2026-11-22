import type React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { HEIGHT, WIDTH } from '../config';
import { rand, sine } from '../lib/anim';
import { COL_W, COL_X, colors, u } from '../theme';

type DustProps = {
  count?: number;
  seed: string;
};

export const Dust: React.FC<DustProps> = ({ count = 24, seed }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
        {Array.from({ length: count }, (_, i) => {
          const x0 = rand(`${seed}-x-${i}`);
          const y0 = rand(`${seed}-y-${i}`);
          const r0 = rand(`${seed}-r-${i}`);
          const s0 = rand(`${seed}-s-${i}`);
          const p0 = rand(`${seed}-p-${i}`);
          const x = COL_X + x0 * COL_W + sine(frame, 150 + i * 7, p0 * Math.PI * 2) * u(8);
          const speed = u(0.15 + s0 * 0.25);
          const y = ((((y0 * HEIGHT - frame * speed) % HEIGHT) + HEIGHT) % HEIGHT);
          return (
            <circle key={i} cx={x} cy={y} r={u(0.5 + r0 * 1.5)} fill={colors.gold} opacity={0.3 + p0 * 0.5} />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
