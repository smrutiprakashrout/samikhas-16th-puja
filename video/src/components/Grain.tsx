import type React from 'react';
import { AbsoluteFill, staticFile } from 'remotion';

export const Grain: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundImage: `url(${staticFile('img/grain.svg')})`,
      backgroundRepeat: 'repeat',
      backgroundSize: '200px 200px',
      opacity: 0.09,
      mixBlendMode: 'multiply',
      pointerEvents: 'none',
    }}
  />
);
