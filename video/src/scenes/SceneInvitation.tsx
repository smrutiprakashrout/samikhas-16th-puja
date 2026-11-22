import type React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Diamond } from '../components/Diamond';
import { Grain } from '../components/Grain';
import { Scene } from '../components/Scene';
import { Words } from '../components/Words';
import { content } from '../generated/content';
import { fadeUp, seg } from '../lib/anim';
import { colors, E, fonts, u } from '../theme';

const PETALS = Array.from({ length: 16 }, (_, i) =>
  `<path d="M0-88c5-8 5-16 0-24c-5 8-5 16 0 24Z" transform="rotate(${i * 22.5})" fill="none" stroke="${colors.wood}" stroke-width=".5"/>`,
).join('');
const MANDALA = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200" fill="none">${PETALS}<circle r="92" stroke="${colors.wood}" stroke-width=".5" stroke-dasharray="1 3"/><circle r="64" stroke="${colors.wood}" stroke-width=".5" stroke-dasharray=".5 2.2"/></svg>`;

export const SceneInvitation: React.FC = () => {
  const frame = useCurrentFrame();
  const words = [
    ...(content.invitation.before as string).split(/\s+/).filter(Boolean).map((w: string) => ({ w, k: false })),
    ...(content.invitation.key as string).split(/\s+/).filter(Boolean).map((w: string) => ({ w, k: true })),
    ...(content.invitation.after as string).split(/\s+/).filter(Boolean).map((w: string) => ({ w, k: false })),
  ];
  const keyStart = words.findIndex((x) => x.k);
  const keyCount = words.filter((x) => x.k).length;
  const underline = seg(frame, 70, 96, E.out);

  return (
    <Scene id="invitation" background={colors.ivory}>
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

        <div
          style={{
            position: 'absolute',
            top: 200,
            bottom: 340,
            left: u(24),
            right: u(24),
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: u(28),
            zIndex: 5,
          }}
        >
          <div style={{ color: 'rgba(35,43,37,.74)', ...fadeUp(frame, 10, 20) }}>
            <span style={{ fontFamily: fonts.sans, fontSize: u(11), fontWeight: 500, letterSpacing: '.24em', textTransform: 'uppercase' }}>
              {content.invitation.label}
            </span>
          </div>

          <div
            style={{
              fontFamily: fonts.display,
              fontWeight: 500,
              fontSize: u(36),
              lineHeight: 1.18,
              color: colors.ink,
              ['textWrap' as string]: 'balance',
            }}
          >
            {words.slice(0, keyStart).map((item, i) => (
              <span key={i} style={{ display: 'inline-block', ...fadeUp(frame, 24 + i * 3, 27, 20, E.out) }}>
                {item.w}{' '}
              </span>
            ))}
            <span style={{ position: 'relative', display: 'inline-block' }}>
              {words.slice(keyStart, keyStart + keyCount).map((item, j) => (
                <span
                  key={j}
                  style={{
                    display: 'inline-block',
                    fontStyle: 'italic',
                    color: colors.saffronDeep,
                    ...fadeUp(frame, 24 + (keyStart + j) * 3, 27, 20, E.out),
                  }}
                >
                  {item.w}
                  {j < keyCount - 1 ? ' ' : ''}
                </span>
              ))}
              <svg
                viewBox="0 0 100 6"
                preserveAspectRatio="none"
                style={{
                  position: 'absolute',
                  left: 0,
                  bottom: '-0.1em',
                  width: '100%',
                  height: u(4),
                  overflow: 'visible',
                }}
              >
                <path
                  d="M0 3 Q 12 1 25 3 T 50 3 T 75 3 T 100 3"
                  fill="none"
                  stroke={colors.saffronDeep}
                  strokeWidth={u(3)}
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - underline}
                />
              </svg>
            </span>
            {' '}
            {words.slice(keyStart + keyCount).map((item, i) => (
              <span key={i} style={{ display: 'inline-block', ...fadeUp(frame, 24 + (keyStart + keyCount + i) * 3, 27, 20, E.out) }}>
                {item.w}{' '}
              </span>
            ))}
          </div>

          <Diamond from={96} width={84} />

          <div
            style={{
              fontFamily: fonts.display,
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: u(20),
              lineHeight: 1.42,
              color: 'rgba(35,43,37,.8)',
              maxWidth: '27ch',
            }}
          >
            <Words text={content.invitation.closing} from={104} stagger={1.4} />
          </div>
        </div>

        <Grain />
      </AbsoluteFill>
    </Scene>
  );
};
