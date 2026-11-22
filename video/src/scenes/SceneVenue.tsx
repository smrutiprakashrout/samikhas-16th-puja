import type React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { DrawnMap } from '../components/DrawnMap';
import { Grain } from '../components/Grain';
import { Label } from '../components/Label';
import { Petals } from '../components/Petals';
import { Scene } from '../components/Scene';
import { content } from '../generated/content';
import { fadeUp, seg } from '../lib/anim';
import { colors, E, fonts } from '../theme';

const ADDRESS_SIZE = 76;
const ADDRESS_LINE = ADDRESS_SIZE * 1.15;
const ADDRESS_TOP = 330 - ADDRESS_LINE / 2;

export const SceneVenue: React.FC = () => {
  const frame = useCurrentFrame();
  const irisR = seg(frame, 30, 70, E.light) * 1000;
  const lines = content.venue.lines as string[];

  return (
    <Scene id="venue" background={colors.sand}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(110% 85% at 50% 48%, transparent 55%, rgba(110,76,40,.20) 100%)`,
          pointerEvents: 'none',
        }}
      />

      <Petals count={6} seed="venue" from={20} />

      <div style={{ position: 'absolute', left: 151, top: 250, transform: 'translateY(-50%)' }}>
        <div style={fadeUp(frame, 10, 20)}>
          <Label>{content.venue.label}</Label>
        </div>
      </div>

      <div style={{ position: 'absolute', left: 151, top: ADDRESS_TOP }}>
        {lines.map((line: string, i: number) => (
          <div
            key={i}
            style={{
              height: ADDRESS_LINE,
              fontFamily: fonts.display,
              fontWeight: 500,
              fontSize: ADDRESS_SIZE,
              lineHeight: 1.15,
              color: colors.ink,
              whiteSpace: 'nowrap',
            }}
          >
            <div style={fadeUp(frame, 16 + i * 8, 30, 16)}>{line}</div>
          </div>
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 151,
          top: 520,
          width: 778,
          height: 760,
          borderRadius: 14,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            clipPath: `circle(${irisR}px at 430px 418px)`,
          }}
        >
          <DrawnMap frame={frame} />
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            border: `2px solid ${colors.wood}`,
            opacity: 0.35,
            borderRadius: 14,
            pointerEvents: 'none',
          }}
        />
      </div>

      <Grain />
    </Scene>
  );
};
