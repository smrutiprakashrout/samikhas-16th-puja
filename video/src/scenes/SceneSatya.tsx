import type React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ClockIcon } from '../components/ClockIcon';
import { Dust } from '../components/Dust';
import { Grain } from '../components/Grain';
import { Kalash } from '../components/Kalash';
import { Label } from '../components/Label';
import { Petals } from '../components/Petals';
import { Scene } from '../components/Scene';
import { Words } from '../components/Words';
import { content } from '../generated/content';
import { videoContent } from '../content.video';
import { fadeUp, seg, sine } from '../lib/anim';
import { colors, E, fonts } from '../theme';

const s = videoContent.satya;
const riseChar = (frame: number, from: number): React.CSSProperties => {
  const p = seg(frame, from, from + 16, E.out);
  return { opacity: p, transform: `translateY(${30 * (1 - p)}px)`, display: 'inline-block' };
};

export const SceneSatya: React.FC = () => {
  const frame = useCurrentFrame();
  const glow = seg(frame, 6, 60, E.out) * (1 + 0.08 * sine(frame, 150));
  const dividerP = seg(frame, 60, 74, E.out);
  const hairline = seg(frame, 98, 114, E.out);
  const clockIn = seg(frame, 104, 116, E.out);
  const diamondPop = seg(frame, 60, 66, E.out);

  return (
    <Scene id="satya" background={colors.ivory}>
      <AbsoluteFill style={{ background: `linear-gradient(180deg,${colors.ivory} 0%,${colors.sandLt} 100%)` }}>
        {/* warm glow behind the kalash */}
        <div
          style={{
            position: 'absolute',
            left: 540,
            top: 546,
            width: 1120,
            height: 1120,
            transform: 'translate(-50%,-50%)',
            borderRadius: '50%',
            opacity: glow,
            background: `radial-gradient(circle,rgba(245,183,78,.42) 0%,rgba(245,183,78,.14) 55%,rgba(245,183,78,0) 100%)`,
            pointerEvents: 'none',
          }}
        />
        <Dust count={20} seed="satya" />
        <Petals count={6} seed="satya" from={70} />

        {/* date line */}
        <div style={{ position: 'absolute', top: 262, left: 0, right: 0, transform: 'translateY(-50%)', textAlign: 'center' }}>
          <Label style={{ fontSize: 25, opacity: 0.74, ...fadeUp(frame, 0, 20) }}>{content.event.dateLong}</Label>
        </div>

        {/* kalash */}
        <div
          style={{
            position: 'absolute',
            left: 540,
            top: 331,
            width: (432 * 200) / 260,
            height: 432,
            marginLeft: -(432 * 200) / 260 / 2,
            zIndex: 3,
          }}
        >
          <Kalash frame={frame} />
        </div>

        {/* title */}
        <div
          style={{
            position: 'absolute',
            top: 892,
            left: 0,
            right: 0,
            transform: 'translateY(-50%)',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            fontFamily: fonts.display,
            fontWeight: 500,
            fontSize: 86,
            lineHeight: 1,
            color: colors.ink,
          }}
        >
          <Words text={s.titleA} from={44} stagger={8} /> <Words text={s.titleB} from={52} stagger={8} style={{ fontStyle: 'italic', color: colors.saffronDeep }} />
        </div>

        {/* divider: two wood lines + saffron diamond */}
        <div
          style={{
            position: 'absolute',
            top: 983,
            left: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 13,
          }}
        >
          <div style={{ width: 164, height: 2, background: 'rgba(168,121,63,.8)', transform: `scaleX(${dividerP})`, transformOrigin: 'center' }} />
          <div
            style={{
              width: 18,
              height: 18,
              background: colors.saffronDeep,
              transform: `rotate(45deg) scale(${diamondPop})`,
              transformOrigin: 'center',
            }}
          />
          <div style={{ width: 164, height: 2, background: 'rgba(168,121,63,.8)', transform: `scaleX(${dividerP})`, transformOrigin: 'center' }} />
        </div>

        {/* "6:00 PM" */}
        <div
          style={{
            position: 'absolute',
            top: 1110,
            left: 0,
            right: 0,
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'nowrap',
            color: colors.saffronDeep,
            fontFamily: fonts.display,
            fontWeight: 500,
          }}
        >
          <span style={{ fontSize: 218, lineHeight: 1, letterSpacing: '-.01em' }}>
            {(s.time as string).split('').map((ch: string, i: number) => (
              <span key={i} style={riseChar(frame, 72 + i * 4)}>
                {ch}
              </span>
            ))}
          </span>
          <span
            style={{
              position: 'relative',
              top: -50,
              marginLeft: 10,
              fontStyle: 'italic',
              fontSize: 66,
              lineHeight: 1,
              ...fadeUp(frame, 90),
            }}
          >
            {s.meridiem}
          </span>
        </div>

        {/* onwards */}
        <div style={{ position: 'absolute', top: 1227, left: 0, right: 0, transform: 'translateY(-50%)', textAlign: 'center' }}>
          <Label style={{ opacity: 0.74, ...fadeUp(frame, 96) }}>{s.timeNote}</Label>
        </div>

        {/* hairline */}
        <div
          style={{
            position: 'absolute',
            top: 1294,
            left: 151,
            width: 778,
            height: 2,
            background: 'rgba(35,43,37,.2)',
            transform: `scaleX(${hairline})`,
            transformOrigin: 'left center',
          }}
        />

        {/* clock + arrival */}
        <div
          style={{
            position: 'absolute',
            left: 545,
            top: 1396,
            transform: 'translate(-50%,-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 34,
          }}
        >
          <div style={{ width: 105, height: 105, opacity: clockIn }}>
            <ClockIcon frame={frame} from={108} dur={30} size={105} />
          </div>
          <div style={{ position: 'relative', width: 320, height: 120 }}>
            <div style={{ position: 'absolute', top: 13, left: 0, whiteSpace: 'nowrap', fontFamily: fonts.display, fontStyle: 'italic', fontWeight: 400, fontSize: 45, lineHeight: 1, color: colors.ink, ...fadeUp(frame, 112) }}>
              {s.arriveLead}
            </div>
            <div style={{ position: 'absolute', top: 55, left: 0, whiteSpace: 'nowrap', fontFamily: fonts.display, fontWeight: 600, fontSize: 66, lineHeight: 1, color: colors.ink, ...fadeUp(frame, 120) }}>
              {s.arriveTime}
            </div>
          </div>
        </div>

        <Grain />
      </AbsoluteFill>
    </Scene>
  );
};
