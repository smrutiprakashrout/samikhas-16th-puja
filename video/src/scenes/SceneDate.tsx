import type React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { Grain } from '../components/Grain';
import { Label } from '../components/Label';
import { Scene } from '../components/Scene';
import { content } from '../generated/content';
import { videoContent } from '../content.video';
import { clamp, fadeUp, rand, seg, sine } from '../lib/anim';
import { colors, E, fonts, u } from '../theme';

const TICKET_W = u(306);
const TICKET_H = u(452);
const PANEL_W = TICKET_W * 0.832;
const PANEL_H = TICKET_H * 0.557;
const PANEL_X = TICKET_W * 0.084;
const PANEL_Y = TICKET_H * 0.178;

const STROKES: Array<Array<[number, number]>> = [
  [[40, 120], [539, 120], [40, 190]],
  [[539, 190], [40, 260], [539, 330]],
  [[40, 330], [539, 400], [40, 470]],
  [[539, 470], [40, 520], [539, 540]],
];
const STROKE_START = [40, 50, 60, 70];

const pathD = (pts: Array<[number, number]>) => `M${pts.map((p) => p.join(' ')).join(' L')}`;
const sample = (pts: Array<[number, number]>, t: number) => {
  const lengths: number[] = [];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    lengths.push(d);
    total += d;
  }
  let left = clamp(t, 0, 1) * total;
  for (let i = 0; i < lengths.length; i++) {
    if (left <= lengths[i] || i === lengths.length - 1) {
      const k = clamp(left / lengths[i], 0, 1);
      const dx = pts[i + 1][0] - pts[i][0];
      const dy = pts[i + 1][1] - pts[i][1];
      return { x: pts[i][0] + dx * k, y: pts[i][1] + dy * k, angle: (Math.atan2(dy, dx) * 180) / Math.PI - 90 };
    }
    left -= lengths[i];
  }
  return { x: pts[pts.length - 1][0], y: pts[pts.length - 1][1], angle: 0 };
};

const RAYS = (() => {
  const seeds = [3, 7, 2, 9, 4, 6, 2, 8, 3, 5, 2, 7, 4, 6];
  let s = '';
  for (let i = 0; i < 14; i++) {
    const w = seeds[i] * 0.9;
    const start = i * 25.7 + (seeds[(i + 3) % 14] - 5);
    s += `rgba(255,243,208,.38) ${start}deg ${start + w}deg,transparent ${start + w}deg ${start + 25.7}deg,`;
  }
  return `conic-gradient(from 0deg,${s.replace(/,$/, '')})`;
})();

export const SceneDate: React.FC = () => {
  const frame = useCurrentFrame();
  const ticketP = seg(frame, 14, 44, E.out);
  const foilOp = 1 - seg(frame, 82, 90, E.out);
  const stylusOp = seg(frame, 40, 44) * (1 - seg(frame, 82, 90));
  const dayP = seg(frame, 84, 104, E.out);
  const shineP = seg(frame, 150, 168);
  const shineX = -100 + 700 * shineP;
  const timeLabel = videoContent.dateScene.timeLabel;

  const activeStroke = STROKES.findIndex((_, i) => frame >= STROKE_START[i] && frame <= STROKE_START[i] + 12);
  const stylus = activeStroke >= 0 ? sample(STROKES[activeStroke], seg(frame, STROKE_START[activeStroke], STROKE_START[activeStroke] + 12)) : null;

  return (
    <Scene id="date" background={colors.saffron}>
      <AbsoluteFill style={{ zIndex: 1, opacity: 0.5, transform: `rotate(${(frame / 2700) * 360}deg)` }}>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '46%',
            width: '230%',
            aspectRatio: '1',
            transform: 'translate(-50%,-50%)',
            background: RAYS,
            WebkitMaskImage: 'radial-gradient(circle,#000 0,transparent 52%)',
            maskImage: 'radial-gradient(circle,#000 0,transparent 52%)',
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          zIndex: 2,
          background: `radial-gradient(110% 85% at 50% 48%,transparent 55%,rgba(178,93,23,.32) 100%)`,
          pointerEvents: 'none',
        }}
      />

      {/* ticket */}
      <div
        style={{
          position: 'absolute',
          left: (1080 - TICKET_W) / 2,
          top: (1920 - TICKET_H) / 2,
          width: TICKET_W,
          height: TICKET_H,
          zIndex: 5,
          opacity: ticketP,
          transform: `translateY(${u(120) * (1 - ticketP)}px)`,
          filter: 'drop-shadow(0 18px 24px rgba(110,48,8,.35)) drop-shadow(0 3px 5px rgba(110,48,8,.25))',
          background: colors.ivory,
          WebkitMaskImage:
            'radial-gradient(circle at 0 76%,transparent 98%,#000) left/51% 100% no-repeat,radial-gradient(circle at 100% 76%,transparent 98%,#000) right/51% 100% no-repeat',
          maskImage:
            'radial-gradient(circle at 0 76%,transparent 98%,#000) left/51% 100% no-repeat,radial-gradient(circle at 100% 76%,transparent 98%,#000) right/51% 100% no-repeat',
        }}
      >
        <div style={{ position: 'absolute', inset: u(8), border: `1px solid rgba(168,121,63,.55)`, pointerEvents: 'none' }} />

        <div style={{ position: 'absolute', top: TICKET_H * 0.072, left: 0, right: 0, textAlign: 'center', color: 'rgba(35,43,37,.78)' }}>
          <Label style={{ fontSize: u(11), opacity: 0.78, color: 'rgba(35,43,37,.78)' }}>{content.date.label}</Label>
          <div style={{ width: u(70), height: u(1), background: colors.wood, margin: `${u(11)}px auto 0`, position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: u(5),
                height: u(5),
                marginTop: -u(2.5),
                marginLeft: -u(2.5),
                background: colors.saffronDeep,
                boxShadow: `0 0 0 ${u(3)}px ${colors.ivory}`,
                transform: 'rotate(45deg)',
              }}
            />
          </div>
        </div>

        {/* foil panel */}
        <div
          style={{
            position: 'absolute',
            left: PANEL_X,
            top: PANEL_Y,
            width: PANEL_W,
            height: PANEL_H,
            background: colors.sandLt,
            boxShadow: `inset 0 0 0 1px rgba(168,121,63,.5)`,
            overflow: 'hidden',
          }}
        >
          {/* revealed content */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: colors.ink,
            }}
          >
            <div
              style={{
                position: 'relative',
                fontFamily: fonts.display,
                fontWeight: 500,
                fontSize: u(121),
                lineHeight: 0.82,
                letterSpacing: '-.04em',
                fontVariantNumeric: 'lining-nums',
                color: colors.saffronDeep,
                textShadow: '0 1.5px 0 rgba(255,249,236,.9)',
                opacity: dayP,
                transform: `scale(${1.15 - 0.15 * dayP})`,
                transformOrigin: 'center',
              }}
            >
              {content.date.day}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  width: u(18),
                  left: shineX,
                  background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.75),transparent)',
                  transform: 'skewX(-18deg)',
                  opacity: frame >= 150 && frame <= 168 ? 0.55 * sine(shineP * Math.PI, 1) : 0,
                  pointerEvents: 'none',
                }}
              />
              {Array.from({ length: 6 }, (_, i) => {
                const a = rand(`date-petal-a-${i}`) * Math.PI * 2;
                const d = u(40 + rand(`date-petal-d-${i}`) * 50);
                const p = seg(frame, 84, 104, E.out);
                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: u(6),
                      height: u(8),
                      borderRadius: '80% 0 80% 0',
                      background: '#FFD58A',
                      opacity: (1 - p) * dayP,
                      transform: `translate(${Math.cos(a) * d * p - u(3)}px,${Math.sin(a) * d * p - u(4)}px) rotate(${a * 57.3 + p * 180}deg)`,
                    }}
                  />
                );
              })}
            </div>
            <div style={{ fontFamily: fonts.display, fontWeight: 500, fontSize: u(27), lineHeight: 1.1, marginTop: u(12), ...fadeUp(frame, 100, 20, 12) }}>
              {content.date.month}
            </div>
            <div style={{ fontFamily: fonts.display, fontStyle: 'italic', fontWeight: 400, fontSize: u(20), lineHeight: 1.2, marginTop: u(3), color: 'rgba(35,43,37,.85)', ...fadeUp(frame, 106, 20, 12) }}>
              {content.date.weekday}
            </div>
            <div style={{ width: u(46), height: 1, background: colors.wood, margin: `${u(11)}px 0 ${u(10)}px`, ...fadeUp(frame, 112, 20, 12) }} />
            {timeLabel ? (
              <div style={{ fontFamily: fonts.sans, fontSize: u(11), fontWeight: 500, letterSpacing: '.24em', textTransform: 'uppercase', color: 'rgba(35,43,37,.78)', ...fadeUp(frame, 112, 20, 12) }}>
                {timeLabel}
              </div>
            ) : null}
            <div style={{ fontFamily: fonts.display, fontWeight: 500, fontSize: u(29), lineHeight: 1, marginTop: u(6), ...fadeUp(frame, 118, 20, 12) }}>
              {content.date.time}
            </div>
            <div style={{ fontFamily: fonts.sans, fontSize: u(10), fontWeight: 500, letterSpacing: '.24em', textTransform: 'uppercase', color: 'rgba(35,43,37,.7)', marginTop: u(6), ...fadeUp(frame, 126, 20, 12) }}>
              {content.date.timeNote}
            </div>
          </div>

          {/* foil with growing scratch mask */}
          <svg viewBox={`0 0 ${PANEL_W} ${PANEL_H}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: foilOp }}>
            <defs>
              <mask id="date-scratch-mask">
                <rect x="0" y="0" width={PANEL_W} height={PANEL_H} fill="white" />
                {STROKES.map((pts, i) => (
                  <path
                    key={i}
                    d={pathD(pts)}
                    fill="none"
                    stroke="black"
                    strokeWidth={u(34)}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={1 - seg(frame, STROKE_START[i], STROKE_START[i] + 12)}
                  />
                ))}
              </mask>
            </defs>
            <rect x="0" y="0" width={PANEL_W} height={PANEL_H} fill={colors.sandLt} />
            <image
              href={staticFile('svg/scratch-foil.svg')}
              x="0"
              y="0"
              width={PANEL_W}
              height={PANEL_H}
              preserveAspectRatio="none"
              mask="url(#date-scratch-mask)"
            />
          </svg>

          {/* stylus */}
          {stylus ? (
            <Img
              src={staticFile('svg/stylus.svg')}
              alt=""
              style={{
                position: 'absolute',
                left: stylus.x - u(12),
                top: stylus.y - u(58),
                width: u(24),
                height: u(60),
                opacity: stylusOp,
                transform: `rotate(${stylus.angle}deg)`,
                transformOrigin: `${u(12)}px ${u(58)}px`,
              }}
            />
          ) : null}
        </div>

        {/* perforation + empty stub */}
        <div style={{ position: 'absolute', left: '5%', right: '5%', top: '76%', borderTop: `1.5px dashed rgba(168,121,63,.65)` }} />
      </div>

      <Grain />
    </Scene>
  );
};
