import type React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { Dust } from '../components/Dust';
import { Grain } from '../components/Grain';
import { Petals } from '../components/Petals';
import { Scene } from '../components/Scene';
import { Vignette } from '../components/Vignette';
import { Words } from '../components/Words';
import { content } from '../generated/content';
import { clamp, fadeUp, seg } from '../lib/anim';
import { colors, E, fonts, u } from '../theme';

const SHIFT = u(56);
const top = (sitePx: number) => u(sitePx) - SHIFT;
const ARCH_W = u(288);
const ARCH_H = u(414);
const PHOTO_W = u(340);
const PHOTO_H = u(490);

export const SceneHero: React.FC = () => {
  const frame = useCurrentFrame();

  const archP = seg(frame, 0, 30, E.out);
  const nicheP = seg(frame, 12, 40, E.out);
  const revealP = seg(frame, 14, 56, E.out);
  const photoScale = 1.28 - 0.2 * revealP - 0.04 * clamp((frame - 56) / 134, 0, 1);
  const digitP = seg(frame, 30, 70, E.out);
  const thP = seg(frame, 60, 72);
  const baseP = seg(frame, 0, 30, E.out);

  const parts = content.title.text.split(' ');
  const plain = parts.slice(0, -1).join(' ');
  const accented = parts[parts.length - 1];

  return (
    <Scene id="hero" background={colors.sand}>
      <AbsoluteFill>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: top(330),
            width: '140%',
            aspectRatio: '1',
            transform: 'translate(-50%,-50%)',
            borderRadius: '50%',
            background:
              'radial-gradient(circle,rgba(255,249,236,.95) 0,rgba(255,226,166,.55) 24%,rgba(245,183,78,.2) 46%,transparent 66%)',
          }}
        />
        <Dust count={16} seed="hero" />
        <Petals count={8} seed="hero" />
        <Vignette />

        {/* arch */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: top(118),
            width: ARCH_W,
            height: ARCH_H,
            marginLeft: -ARCH_W / 2,
            zIndex: 6,
          }}
        >
          <svg viewBox="0 0 288 414" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', opacity: nicheP }}>
            <defs>
              <linearGradient id="hero-nf" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#F4E4CC" />
                <stop offset=".6" stopColor="#EFD7B3" />
                <stop offset="1" stopColor="#EBCEAE" />
              </linearGradient>
              <radialGradient id="hero-nr" cx=".5" cy=".28" r=".6">
                <stop offset="0" stopColor="#FFF9EC" stopOpacity=".95" />
                <stop offset="1" stopColor="#FFF9EC" stopOpacity="0" />
              </radialGradient>
            </defs>
            <path d="M0 414V145A144 144 0 0 1 288 145V414Z" fill="url(#hero-nf)" />
            <path d="M0 414V145A144 144 0 0 1 288 145V414Z" fill="url(#hero-nr)" />
          </svg>
          <svg viewBox="0 0 288 414" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }} fill="none">
            <path
              d="M1 414V145A143 143 0 0 1 287 145V414"
              stroke="#A8793F"
              strokeWidth={1.3}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - archP}
            />
          </svg>
          <svg
            viewBox="-12 -12 312 438"
            preserveAspectRatio="none"
            style={{ position: 'absolute', left: -12, top: -12, width: `calc(100% + 24px)`, height: `calc(100% + 24px)`, overflow: 'visible', opacity: archP > 0 ? 1 : 0 }}
            fill="none"
          >
            <path
              d="M-11 414V145A155 155 0 0 1 299 145V414"
              stroke="#E0AF70"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeDasharray={`${archP} 1`}
            />
          </svg>
        </div>

        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: top(532),
            width: u(330),
            height: 1,
            marginLeft: -u(330) / 2,
            background: colors.wood,
            zIndex: 6,
            transform: `scaleX(${baseP})`,
            transformOrigin: 'center',
          }}
        />

        {/* digits behind her */}
        {[
          { text: content.title.number, x: '50%', dx: -u(151), cls: 'd1' },
          { text: content.title.number, x: '50%', dx: u(27), cls: 'd6' },
        ].map((d, i) => {
          const e = i === 0 ? digitP : seg(frame, 38, 76, E.out);
          return (
            <div
              key={d.cls}
              style={{
                position: 'absolute',
                left: `calc(${d.x} + ${d.dx}px)`,
                top: top(100),
                zIndex: 8,
                fontFamily: fonts.display,
                fontWeight: 500,
                fontSize: u(196),
                lineHeight: 1,
                fontVariantNumeric: 'lining-nums',
                letterSpacing: '-.03em',
                backgroundImage: 'linear-gradient(180deg,#E48C35,#B25D17)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                filter: 'drop-shadow(0 1.5px 0 rgba(255,249,236,.85)) drop-shadow(0 8px 10px rgba(110,76,40,.25))',
                opacity: e,
                transform: `translateY(${u(60) * (1 - e)}px)`,
              }}
            >
              {d.text}
            </div>
          );
        })}
        <div
          style={{
            position: 'absolute',
            left: `calc(50% + ${u(131)}px)`,
            top: top(116),
            zIndex: 8,
            fontFamily: fonts.display,
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: u(50),
            lineHeight: 1,
            color: colors.saffronDeep,
            opacity: thP,
            transformOrigin: '0 100%',
            transform: `scale(${0.6 + 0.4 * thP})`,
          }}
        >
          {content.title.suffix}
        </div>

        {/* her */}
        <div
          style={{
            position: 'absolute',
            left: `calc(50% - ${u(180)}px)`,
            top: top(78),
            width: PHOTO_W,
            height: PHOTO_H,
            zIndex: 10,
            overflow: 'hidden',
            clipPath: `inset(${(1 - revealP) * 100}% 0 0 0)`,
            WebkitMaskImage: `linear-gradient(180deg,#000 0,#000 calc(100% - ${u(48)}px),transparent 100%)`,
            maskImage: `linear-gradient(180deg,#000 0,#000 calc(100% - ${u(48)}px),transparent 100%)`,
            opacity: clamp(revealP * 1.6, 0, 1),
          }}
        >
          <Img
            src={staticFile(content.honoree.photo.replace(/^\//, ''))}
            alt={content.honoree.photoAlt}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              transform: `scale(${photoScale})`,
              filter: 'drop-shadow(0 0 1px rgba(255,249,236,.95)) drop-shadow(0 0 6px rgba(255,249,236,.35))',
              scale: 0.94,
              translate: '51.8px 0px'
            }}
          />
        </div>

        {/* title */}
        <div
          style={{
            position: 'absolute',
            top: top(590),
            left: 0,
            right: 0,
            zIndex: 12,
            textAlign: 'center',
            fontFamily: fonts.display,
            fontWeight: 500,
            fontSize: u(38),
            lineHeight: 1,
          }}
        >
          {plain ? <Words text={plain} from={64} stagger={4} /> : null}
          {plain ? ' ' : ''}
          <Words text={accented} from={64 + plain.split(' ').length * 4} stagger={4} style={{ fontStyle: 'italic', color: colors.saffronDeep }} />
        </div>

        <div
          style={{
            position: 'absolute',
            top: top(640),
            left: 0,
            right: 0,
            zIndex: 12,
            textAlign: 'center',
            fontFamily: fonts.display,
            fontWeight: 500,
            fontSize: u(64),
            lineHeight: 1.02,
            letterSpacing: '-.01em',
            color: colors.ink,
          }}
        >
          {(content.honoree.first as string).split('').map((ch: string, i: number) => (
            <span key={i} style={{ display: 'inline-block', ...fadeUp(frame, 96 + i * 3, 12, 10) }}>
              {ch}
            </span>
          ))}
        </div>

        <div
          style={{
            position: 'absolute',
            top: top(728),
            left: 0,
            right: 0,
            zIndex: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: u(12),
            color: 'rgba(35,43,37,.78)',
            fontFamily: fonts.sans,
            fontSize: u(11),
            fontWeight: 500,
            letterSpacing: '.24em',
            textTransform: 'uppercase',
            ...fadeUp(frame, 120, 27, 20, E.out),
          }}
        >
          <span style={{ width: u(28), height: 1, background: colors.wood, transform: `scaleX(${seg(frame, 120, 140)})` }} />
          <span>{content.honoree.rest}</span>
          <span style={{ width: u(28), height: 1, background: colors.wood, transform: `scaleX(${seg(frame, 120, 140)})` }} />
        </div>

        <div
          style={{
            position: 'absolute',
            width: 1,
            height: 1,
            overflow: 'hidden',
            clip: 'rect(0,0,0,0)',
          }}
        >
          {content.title.number}
          {content.title.suffix} {content.title.text}
        </div>

        <Grain />
      </AbsoluteFill>
    </Scene>
  );
};
