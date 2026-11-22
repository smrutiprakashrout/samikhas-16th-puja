import type React from 'react';
import { random } from 'remotion';
import { E, u } from '../theme';

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const seg = (frame: number, from: number, to: number, ease: (n: number) => number = E.out) => {
  return ease(clamp((frame - from) / (to - from), 0, 1));
};

export const fadeUp = (
  frame: number,
  from: number,
  dur = 27,
  dist = 20,
  ease: (n: number) => number = E.out,
): React.CSSProperties => {
  const p = seg(frame, from, from + dur, ease);
  return { opacity: p, transform: `translateY(${u(dist) * (1 - p)}px)` };
};

export const wipe = (
  frame: number,
  from: number,
  dur = 24,
  ease: (n: number) => number = E.out,
): React.CSSProperties => {
  const p = seg(frame, from, from + dur, ease);
  return { clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`, transform: `translateY(${u(8) * (1 - p)}px)` };
};

export const sine = (frame: number, periodFrames: number, phase = 0) => {
  return Math.sin((frame / periodFrames) * Math.PI * 2 + phase);
};

export const rand = (seed: string) => random(seed);
