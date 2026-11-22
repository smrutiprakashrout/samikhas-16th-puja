import type React from 'react';
import { Easing } from 'remotion';
import { HEIGHT } from './config';

export const colors = {
  ink: '#232B25',
  inkDeep: '#181E1A',
  moss: '#5D695D',
  sage: '#AAA06D',
  ivory: '#FBF3E4',
  sand: '#EBCEAE',
  sandLt: '#F4E4CC',
  sandDp: '#D8B684',
  wood: '#A8793F',
  woodDk: '#6E4C28',
  gold: '#E0AF70',
  marigold: '#F5B74E',
  saffron: '#E48C35',
  saffronDeep: '#B25D17',
  flood: '#FFF9EC',
} as const;

export const cssVars: React.CSSProperties = {
  '--ink': colors.ink,
  '--ink-deep': colors.inkDeep,
  '--moss': colors.moss,
  '--sage': colors.sage,
  '--ivory': colors.ivory,
  '--sand': colors.sand,
  '--sand-lt': colors.sandLt,
  '--sand-dp': colors.sandDp,
  '--wood': colors.wood,
  '--wood-dk': colors.woodDk,
  '--gold': colors.gold,
  '--marigold': colors.marigold,
  '--saffron': colors.saffron,
  '--saffron-deep': colors.saffronDeep,
  '--flood': colors.flood,
} as React.CSSProperties;

export const fonts = {
  display: 'Cormorant Garamond',
  sans: 'DM Sans',
  odia: "'Noto Serif Oriya', 'Noto Sans Oriya', serif",
} as const;

export const E = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  door: Easing.bezier(0.65, 0, 0.25, 1),
  light: Easing.bezier(0.5, 0, 0.2, 1),
  flood: Easing.bezier(0.6, 0, 0.9, 0.4),
} as const;

export const U = HEIGHT / 844;
export const u = (n: number) => n * U;
export const COL_W = 390 * U;
export const COL_X = (1080 - COL_W) / 2;
