import type React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { seg } from '../lib/anim';
import { colors, E, u } from '../theme';

type DiamondProps = {
  from: number;
  width?: number;
  color?: string;
};

export const Diamond: React.FC<DiamondProps> = ({ from, width = 164, color = colors.gold }) => {
  const frame = useCurrentFrame();
  const lineP = seg(frame, from, from + 18, E.out);
  const pop = interpolate(frame, [from, from + 6, from + 12], [0, 1.15, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const half = u(width) / 2;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: u(10) }}>
      <div style={{ width: half, height: 1, background: color, transform: `scaleX(${lineP})`, transformOrigin: 'center' }} />
      <div
        style={{
          width: u(8),
          height: u(8),
          background: colors.saffronDeep,
          transform: `rotate(45deg) scale(${pop})`,
          transformOrigin: 'center',
        }}
      />
      <div style={{ width: half, height: 1, background: color, transform: `scaleX(${lineP})`, transformOrigin: 'center' }} />
    </div>
  );
};
