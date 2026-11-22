import type React from 'react';
import { AbsoluteFill } from 'remotion';
import { SHOW_SAFE_ZONES } from '../config';
import { COL_W, COL_X } from '../theme';

export const SafeZones: React.FC = () => {
  if (!SHOW_SAFE_ZONES) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 200, background: 'rgba(255,0,0,.12)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 340, background: 'rgba(255,0,0,.12)' }} />
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: COL_X, width: COL_W, border: '1px solid rgba(255,0,0,.5)' }} />
    </AbsoluteFill>
  );
};
