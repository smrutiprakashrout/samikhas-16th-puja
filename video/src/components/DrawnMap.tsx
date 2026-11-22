import type React from 'react';
import { spring } from 'remotion';
import { FPS } from '../config';
import { seg } from '../lib/anim';
import { colors, E } from '../theme';

const MINOR_ROADS = [
  'M -20 300 C 120 280 240 300 360 270 S 600 180 800 120',
  'M 600 -20 C 620 140 640 260 700 360 S 790 520 800 560',
  'M -20 700 L 340 660',
  'M 520 520 L 800 640',
  'M 80 120 L 300 200',
];
const MAJOR_ROADS = [
  'M -20 610 C 150 560 290 480 420 410 S 700 280 800 200',
  'M 250 -20 C 300 160 400 290 430 420 S 520 690 560 780',
];
const ROUTE = 'M 30 740 C 120 640 220 560 320 500 S 400 440 430 418';

const draw = (p: number): React.SVGProps<SVGPathElement> => ({
  pathLength: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1 - p,
});

export const DrawnMap: React.FC<{ frame: number }> = ({ frame }) => {
  const routeP = seg(frame, 70, 100, E.light);
  const drop = spring({
    frame: frame - 96,
    fps: FPS,
    config: { damping: 12, stiffness: 120, mass: 1 },
    durationInFrames: 16,
  });
  const dropY = -300 * (1 - drop);
  const squash = frame >= 112 && frame < 115 ? 0.9 : 1;
  const pinOpacity = seg(frame, 94, 96);
  const shadowP = seg(frame, 104, 112, E.out);
  const rippleCycle = frame >= 110 ? (((frame - 110) % 50) / 50) : 0;
  const rippleScale = 1 + 2.2 * rippleCycle;
  const rippleOpacity = 0.55 * (1 - rippleCycle);

  return (
    <svg viewBox="0 0 778 760" width="100%" height="100%" style={{ display: 'block' }}>
      <rect width="778" height="760" fill={colors.sandLt} />

      <ellipse cx="150" cy="180" rx="90" ry="60" fill={colors.sage} fillOpacity={0.35} />
      <ellipse cx="640" cy="600" rx="110" ry="70" fill={colors.sage} fillOpacity={0.35} />

      {MINOR_ROADS.map((d, i) => (
        <path
          key={`minor-${i}`}
          d={d}
          fill="none"
          stroke={colors.ivory}
          strokeWidth={12}
          strokeLinecap="round"
          {...draw(seg(frame, 40 + i * 4, 56 + i * 4, E.out))}
        />
      ))}

      {MAJOR_ROADS.map((d, i) => {
        const p = seg(frame, 60 + i * 4, 76 + i * 4, E.out);
        return (
          <g key={`major-${i}`}>
            <path
              d={d}
              fill="none"
              stroke={colors.wood}
              strokeOpacity={0.25}
              strokeWidth={26}
              strokeLinecap="round"
              {...draw(p)}
            />
            <path
              d={d}
              fill="none"
              stroke={colors.ivory}
              strokeWidth={22}
              strokeLinecap="round"
              {...draw(p)}
            />
          </g>
        );
      })}

      <mask id="venue-route-mask" maskUnits="userSpaceOnUse">
        <rect width="778" height="760" fill="white" />
        <path
          d={ROUTE}
          fill="none"
          stroke="black"
          strokeWidth={18}
          strokeLinecap="round"
          {...draw(routeP)}
        />
      </mask>
      <path
        d={ROUTE}
        fill="none"
        stroke={colors.saffronDeep}
        strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray="1 16"
        mask="url(#venue-route-mask)"
      />

      <ellipse cx="430" cy="420" rx="22" ry="7" fill={colors.woodDk} fillOpacity={0.25 * shadowP} />

      {frame >= 110 ? (
        <g transform={`translate(430 418) scale(${rippleScale})`} opacity={rippleOpacity}>
          <circle r="18" fill="none" stroke={colors.saffronDeep} strokeWidth={3} />
        </g>
      ) : null}

      <g
        opacity={pinOpacity}
        transform={`translate(430 418) translate(0 ${dropY}) scale(1 ${squash}) translate(-430 -418)`}
      >
        <path
          d="M430 362 C410 362 398 374 398 390 C398 406 430 418 430 418 C430 418 462 406 462 390 C462 374 450 362 430 362 Z"
          fill={colors.saffron}
          stroke={colors.saffronDeep}
          strokeWidth={3}
        />
        <circle cx="430" cy="389" r="9" fill={colors.ivory} />
      </g>
    </svg>
  );
};
