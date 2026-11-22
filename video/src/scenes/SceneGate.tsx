import type React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { Grain } from '../components/Grain';
import { Label } from '../components/Label';
import { Scene } from '../components/Scene';
import { u, colors, E } from '../theme';
import { rand, seg, sine } from '../lib/anim';
import { content } from '../generated/content';
import { doorSvg } from './doorArt';

const ART_W = u(195);
const EXT = 540 - ART_W;
const NUM = 367;

const raySeeds = [3, 7, 2, 9, 4, 6, 2, 8, 3, 5, 2, 7, 4, 6];
const RAY_BG = (() => {
  let s = '';
  for (let i = 0; i < 14; i++) {
    const w = raySeeds[i] * 0.9;
    const start = i * 25.7 + (raySeeds[(i + 3) % 14] - 5);
    s += `rgba(255,240,200,.6) ${start}deg ${start + w}deg, transparent ${start + w}deg ${start + 25.7}deg,`;
  }
  return `conic-gradient(from 0deg, ${s.replace(/,$/, '')})`;
})();

const WOD_GRAIN = 'repeating-linear-gradient(90deg,rgba(110,76,40,.05) 0 1px,transparent 1px 6px)';
const faceBg = (side: 'l' | 'r') =>
  `${WOD_GRAIN}, linear-gradient(${side === 'l' ? '90deg' : '270deg'},var(--sand-dp),var(--sand) 55%,var(--sand-lt))`;

const Numeral: React.FC = ({ }) => {
  const frame = useCurrentFrame();
  const shine = (frame % 150) / 150;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 2,
      }}
    >
      <span
        style={{
          fontFamily: 'Cormorant Garamond',
          fontWeight: 500,
          fontSize: NUM,
          lineHeight: 1,
          letterSpacing: '-.02em',
          backgroundImage:
            'linear-gradient(105deg,#B25D17 0,#E48C35 30%,#FFD9A0 42%,#E48C35 54%,#B25D17 100%)',
          backgroundSize: '250% 100%',
          backgroundPosition: `${100 - shine * 100}% 0`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          filter: 'drop-shadow(0 1.5px 0 rgba(255,249,236,.85)) drop-shadow(0 8px 10px rgba(110,76,40,.3))',
          whiteSpace: 'nowrap',
        }}
      >
        16<sup style={{ fontSize: '.3em', verticalAlign: 'top', position: 'relative', top: '.28em', marginLeft: '.04em', fontStyle: 'italic' }}>th</sup>
      </span>
    </div>
  );
};

export const SceneGate: React.FC = () => {
  const frame = useCurrentFrame();

  const backOp = 0.45 + 0.15 * sine(frame, 96);
  const seamPulse = 0.9 + 0.1 * ((sine(frame, 96) + 1) / 2);
  const latch = interpolate(frame, [56, 70, 84], [0, 1, 0], {
    easing: E.door,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const swing = seg(frame, 84, 150, E.door);
  const seamScale = 1 + 6 * seg(frame, 56, 84, E.door);
  const kickerIn = seg(frame, 8, 28);
  const kickerOut = 1 - seg(frame, 56, 84);
  const darkP = 0.35 * swing;
  const bloomP = seg(frame, 80, 170, E.light);
  const coreScale = 0.2 + 3.0 * bloomP;
  const rayRot = 25 * seg(frame, 80, 170);
  const streakP = seg(frame, 80, 170);
  const innerGlow = bloomP;
  const floodP = seg(frame, 150, 195, E.flood);

  const artLeft = doorSvg.replaceAll('{{p}}', 'gl');
  const artRight = doorSvg.replaceAll('{{p}}', 'gr');

  const door = (side: 'l' | 'r'): React.CSSProperties => ({
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 540,
    overflow: 'hidden',
    ...(side === 'l' ? { left: 0 } : { right: 0 }),
    transform: `rotateY(${side === 'l' ? -1.2 * latch - 104 * swing : 1.2 * latch + 104 * swing}deg)`,
    transformOrigin: side === 'l' ? '0% 50%' : '100% 50%',
    transformStyle: 'preserve-3d',
    backfaceVisibility: 'hidden',
  });

  const artBox = (side: 'l' | 'r'): React.CSSProperties => ({
    position: 'absolute',
    top: 0,
    width: ART_W,
    height: '100%',
    ...(side === 'l' ? { left: EXT } : { left: 0, transform: 'scaleX(-1)', transformOrigin: 'center' }),
    ['--back-op' as string]: backOp,
  });

  const numeralBox = (side: 'l' | 'r'): React.CSSProperties => ({
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: ART_W * 2,
    ...(side === 'l' ? { left: EXT } : { left: -ART_W }),
  });

  return (
    <Scene id="gate" background={colors.sand} pushTo={1.04}>
      <AbsoluteFill>
        {/* light behind the doors */}
        <AbsoluteFill style={{ zIndex: 2, opacity: seg(frame, 80, 170) }}>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '260%',
              aspectRatio: '1',
              transform: `translate(-50%,-50%) rotate(${rayRot}deg)`,
              background: RAY_BG,
              WebkitMaskImage: 'radial-gradient(circle,#000 0,transparent 60%)',
              maskImage: 'radial-gradient(circle,#000 0,transparent 60%)',
              opacity: 0.9,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '150%',
              aspectRatio: '1',
              borderRadius: '50%',
              transform: `translate(-50%,-50%) scale(${coreScale})`,
              background:
                'radial-gradient(circle,#fff 0,#FFF6E0 14%,#FFE2A6 30%,#F5B74E 52%,rgba(228,140,53,.35) 70%,transparent 82%)',
            }}
          />
        </AbsoluteFill>

        <AbsoluteFill style={{ perspective: '2500px', zIndex: 5 }}>
          {(['l', 'r'] as const).map((side) => (
            <div key={side} style={door(side)}>
              <AbsoluteFill style={{ background: faceBg(side) }} />
              <Grain />
              <div style={artBox(side)} dangerouslySetInnerHTML={{ __html: side === 'l' ? artLeft : artRight }} />
              <div style={numeralBox(side)}>
                <Numeral />
              </div>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  boxShadow:
                    side === 'l'
                      ? 'inset -26px 0 60px -18px rgba(255,246,224,.95)'
                      : 'inset 26px 0 60px -18px rgba(255,246,224,.95)',
                  opacity: innerGlow,
                  pointerEvents: 'none',
                }}
              />
              <AbsoluteFill style={{ background: 'var(--wood-dk)', opacity: darkP, pointerEvents: 'none' }} />
            </div>
          ))}
        </AbsoluteFill>

        {/* seam */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: 3,
            marginLeft: -1.5,
            zIndex: 6,
            background: 'linear-gradient(#FFF6E0,#FFE2A6 50%,#FFF6E0)',
            boxShadow: '0 0 14px 3px rgba(255,226,166,.9),0 0 40px 10px rgba(245,183,78,.45)',
            opacity: seamPulse,
            transform: `scaleX(${seamScale})`,
            transformOrigin: 'center',
          }}
        />

        {/* streak + bloom */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: '30%',
            zIndex: 8,
            transform: `translateX(-50%) scaleX(${0.15 + 1.45 * streakP})`,
            opacity: streakP,
            mixBlendMode: 'screen',
            pointerEvents: 'none',
            background:
              'radial-gradient(ellipse at center,rgba(255,246,224,.95) 0,rgba(255,226,166,.5) 35%,transparent 70%)',
          }}
        />
        <AbsoluteFill
          style={{
            zIndex: 8,
            mixBlendMode: 'screen',
            opacity: bloomP,
            transform: `scale(${0.3 + 1.2 * bloomP})`,
            pointerEvents: 'none',
            background:
              'radial-gradient(circle at 50% 50%,#fff 0,rgba(255,246,224,.85) 12%,rgba(255,226,166,.45) 32%,rgba(245,183,78,.18) 55%,transparent 72%)',
          }}
        />

        {/* embers */}
        <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0, zIndex: 7 }}>
          {Array.from({ length: 34 }, (_, i) => {
            const x0 = rand(`gate-ember-x-${i}`);
            const y0 = rand(`gate-ember-y-${i}`);
            const r0 = rand(`gate-ember-r-${i}`);
            const v0 = rand(`gate-ember-v-${i}`);
            const ph = rand(`gate-ember-p-${i}`) * Math.PI * 2;
            const x = x0 * 1080 + sine(frame, 140, ph) * u(8);
            const y = (((y0 * 1920 - frame * u(0.12 + v0 * 0.35)) % 1920) + 1920) % 1920;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={u(0.5 + r0 * 1.5)}
                fill={i % 2 ? colors.marigold : '#FFFFFF'}
                opacity={(0.3 + 0.5 * rand(`gate-ember-a-${i}`)) * (1 - seg(frame, 84, 120))}
              />
            );
          })}
        </svg>

        {/* specks */}
        <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0, zIndex: 7 }}>
          {Array.from({ length: 26 }, (_, i) => {
            const a0 = rand(`gate-speck-a-${i}`);
            const y0 = rand(`gate-speck-y-${i}`);
            const sp = 1 + rand(`gate-speck-s-${i}`) * 2.4;
            const age = Math.max(0, frame - 84);
            const dir = a0 < 0.5 ? Math.PI : 0;
            const ang = dir + (rand(`gate-speck-d-${i}`) - 0.5) * 2.4;
            const x = 540 + Math.cos(ang) * sp * age * 0.992;
            const y = 1920 * (0.2 + y0 * 0.6) + Math.sin(ang) * sp * age * 0.992;
            return <circle key={i} cx={x} cy={y} r={u(0.5 + rand(`gate-speck-r-${i}`) * 1.6)} fill="#FFFFFF" opacity={Math.max(0, 0.9 - age * 0.009)} />;
          })}
        </svg>

        {/* kicker */}
        <div style={{ position: 'absolute', top: u(28), left: 0, right: 0, zIndex: 9, textAlign: 'center', opacity: kickerIn * kickerOut }}>
          <Label style={{ color: 'rgba(35,43,37,.78)' }}>{content.gate.kicker}</Label>
        </div>

        {/* flood */}
        <AbsoluteFill style={{ zIndex: 20, background: '#FFF9EC', opacity: floodP }} />
      </AbsoluteFill>
    </Scene>
  );
};
