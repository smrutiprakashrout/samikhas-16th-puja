import type React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { OVERLAP, SCENES } from '../config';
import { clamp, seg } from '../lib/anim';
import { cssVars, E } from '../theme';
import { SafeZones } from './SafeZones';

type SceneProps = {
  id: string;
  background: string;
  children?: React.ReactNode;
};

export const Scene: React.FC<SceneProps> = ({ id, background, children }) => {
  const frame = useCurrentFrame();
  const entry = SCENES.find((s) => s.id === id) ?? SCENES[0];
  const p = seg(frame, 0, OVERLAP, entry.in === 'fade' ? E.out : E.light);

  let transition: React.CSSProperties = {};
  if (entry.in === 'fade') transition = { opacity: p };
  else if (entry.in === 'rise') transition = { clipPath: `inset(${(1 - p) * 100}% 0 0 0)` };
  else if (entry.in === 'circle') transition = { clipPath: `circle(${p * 1500}px at 50% 55%)` };

  const push = 1 + 0.03 * clamp(frame / entry.length, 0, 1);

  return (
    <AbsoluteFill style={{ ...cssVars, background }}>
      <AbsoluteFill style={transition}>
        <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: 'center center' }}>
          {children}
        </AbsoluteFill>
      </AbsoluteFill>
      <SafeZones />
    </AbsoluteFill>
  );
};
