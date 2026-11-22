import type React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Dust } from '../components/Dust';
import { Grain } from '../components/Grain';
import { Label } from '../components/Label';
import { Scene } from '../components/Scene';
import { content } from '../generated/content';
import { fadeUp, seg } from '../lib/anim';
import { COL_X, colors, E, fonts, u } from '../theme';

// The site's thread spans y=231u..626u. Centre that span in the film's safe area.
const OFFSET = -85;
const sy = (site: number) => u(site) + OFFSET;
const THREAD_X = COL_X + u(24.5);
const TEXT_X = COL_X + u(44);
const NAME_SIZE = u(30.4);

const PETALS = Array.from({ length: 16 }, (_, i) =>
  `<path d="M0-88c5-8 5-16 0-24c-5 8-5 16 0 24Z" transform="rotate(${i * 22.5})" fill="none" stroke="${colors.wood}" stroke-width=".5"/>`,
).join('');
const MANDALA = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200" fill="none">${PETALS}<circle r="92" stroke="${colors.wood}" stroke-width=".5" stroke-dasharray="1 3"/><circle r="64" stroke="${colors.wood}" stroke-width=".5" stroke-dasharray=".5 2.2"/></svg>`;

const Blossom: React.FC<{ frame: number }> = ({ frame }) => {
  const open = seg(frame, 100, 122, E.out);
  return (
    <svg
      viewBox="-16 -16 32 32"
      style={{
        width: u(31),
        height: u(31),
        overflow: 'visible',
        transform: `rotate(${-40 + 40 * open}deg)`,
      }}
    >
      {Array.from({ length: 10 }, (_, i) => {
        const p = seg(frame, 100 + i * 3, 122, E.out);
        return (
          <g key={i} transform={`rotate(${i * 36}) scale(${p})`}>
            <ellipse cx="0" cy="-8" rx="4.4" ry="7.6" fill={colors.marigold} stroke={colors.saffronDeep} strokeOpacity={0.45} strokeWidth={0.5} />
          </g>
        );
      })}
      <circle r="6.2" fill="#FFD58A" transform={`scale(${open})`} />
      <circle r="2.4" fill={colors.saffronDeep} fillOpacity={0.75} transform={`scale(${open})`} />
    </svg>
  );
};

const NameBlock: React.FC<{ label: string; names: string[]; frame: number; from: number }> = ({ label, names, frame, from }) => (
  <div style={{ position: 'absolute', top: sy(from), left: TEXT_X, right: COL_X + u(24), zIndex: 6 }}>
    <div style={{ maxWidth: u(280), color: 'rgba(35,43,37,.74)', ...fadeUp(frame, from === 226 ? 26 : 70, 15) }}>
      <Label style={{ maxWidth: u(280), opacity: 0.74 }}>{label}</Label>
    </div>
    {names.map((name: string, i: number) => (
      <div
        key={i}
        style={{
          marginTop: i === 0 ? u(12) : 0,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          fontFamily: fonts.display,
          fontWeight: 500,
          fontSize: NAME_SIZE,
          lineHeight: 1.2,
          color: colors.ink,
        }}
      >
        <span style={{ display: 'block', ...fadeUp(frame, (from === 226 ? 34 : 78) + i * 8, 14) }}>
          {i === 1 ? <em style={{ fontStyle: 'italic', color: colors.saffronDeep, marginRight: '.18em' }}>&amp;</em> : null}
          {name}
        </span>
      </div>
    ))}
  </div>
);

export const SceneFamily: React.FC = () => {
  const frame = useCurrentFrame();
  const threadP = seg(frame, 10, 60, E.light);
  const node1 = seg(frame, 20, 32, E.out);
  const node2 = seg(frame, 64, 76, E.out);

  return (
    <Scene id="family" background={colors.ivory}>
      <AbsoluteFill>
        <div
          style={{
            position: 'absolute',
            right: -u(190),
            top: u(250),
            width: u(470),
            aspectRatio: '1',
            opacity: 0.1,
            transform: `rotate(${(frame / 1800) * 360}deg)`,
            pointerEvents: 'none',
          }}
          dangerouslySetInnerHTML={{ __html: MANDALA }}
        />
        <AbsoluteFill
          style={{
            background: `radial-gradient(120% 90% at 50% 45%, transparent 60%, ${colors.sandLt} 100%)`,
            opacity: 0.35,
            pointerEvents: 'none',
          }}
        />
        <Dust count={12} seed="family" />

        {/* vertical thread */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 4, overflow: 'visible' }}>
          <path
            d={`M${THREAD_X} ${sy(231)} V${sy(626)}`}
            stroke={colors.wood}
            strokeWidth={u(1.2)}
            fill="none"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - threadP}
          />
        </svg>

        {/* diamond nodes */}
        {[
          { y: sy(231), p: node1 },
          { y: sy(431), p: node2 },
        ].map((node, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: THREAD_X - u(9) / 2,
              top: node.y - u(9) / 2,
              width: u(9),
              height: u(9),
              background: colors.saffronDeep,
              boxShadow: `0 0 0 ${u(5)}px ${colors.ivory}`,
              transform: `rotate(45deg) scale(${node.p})`,
              transformOrigin: 'center',
              zIndex: 5,
            }}
          />
        ))}

        <NameBlock label={content.family.parentsLabel} names={content.family.parents as string[]} frame={frame} from={226} />
        <NameBlock label={content.family.grandLabel} names={content.family.grand as string[]} frame={frame} from={426} />

        {/* blossom at the thread's end */}
        <div
          style={{
            position: 'absolute',
            left: THREAD_X,
            top: sy(626),
            transform: 'translate(-50%,-50%)',
            zIndex: 6,
          }}
        >
          <Blossom frame={frame} />
        </div>

        <Grain />
      </AbsoluteFill>
    </Scene>
  );
};
