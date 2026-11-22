import type React from 'react';
import { seg } from '../lib/anim';
import { colors, E } from '../theme';

type ClockIconProps = {
  frame: number;
  from: number;
  dur: number;
  size?: number;
};

const point = (c: number, r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return { x: c + Math.sin(a) * r, y: c - Math.cos(a) * r };
};

export const ClockIcon: React.FC<ClockIconProps> = ({ frame, from, dur, size = 105 }) => {
  const c = size / 2;
  const R = size / 2;
  const sweep = seg(frame, from, from + dur, E.light);
  const minuteAngle = 180 * sweep;
  const hourAngle = 150 + 15 * sweep;
  const minute = point(c, R * 0.66, minuteAngle);
  const hour = point(c, R * 0.46, hourAngle);
  const pulseStart = from + dur;
  const pulseP = seg(frame, pulseStart, pulseStart + 24, E.out);
  const pulseOp = frame >= pulseStart ? 0.5 * (1 - pulseP) : 0;
  const pulseR = R + R * 0.6 * pulseP;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ overflow: 'visible' }}>
      <circle cx={c} cy={c} r={R - 3} fill={colors.ivory} fillOpacity={0.7} stroke={colors.wood} strokeWidth={2.5} />
      {Array.from({ length: 12 }, (_, i) => {
        const deg = i * 30;
        const hourTick = i % 3 === 0;
        const outer = point(c, R - 9, deg);
        const inner = point(c, R - 9 - (hourTick ? 9 : 4), deg);
        return (
          <line
            key={i}
            x1={outer.x}
            y1={outer.y}
            x2={inner.x}
            y2={inner.y}
            stroke={colors.woodDk}
            strokeWidth={hourTick ? 3 : 1.6}
            strokeLinecap="round"
          />
        );
      })}
      <line x1={c} y1={c} x2={hour.x} y2={hour.y} stroke={colors.ink} strokeWidth={4.5} strokeLinecap="round" />
      <line x1={c} y1={c} x2={minute.x} y2={minute.y} stroke={colors.ink} strokeWidth={3} strokeLinecap="round" />
      <circle cx={c} cy={c} r={5.5} fill={colors.saffronDeep} />
      <circle cx={c} cy={c} r={pulseR} fill="none" stroke={colors.saffronDeep} strokeWidth={2} opacity={pulseOp} />
    </svg>
  );
};
