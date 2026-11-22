import type React from 'react';
import { AbsoluteFill } from 'remotion';

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, var(--sand-dp) 100%)',
      opacity: 0.22,
      pointerEvents: 'none',
    }}
  />
);
