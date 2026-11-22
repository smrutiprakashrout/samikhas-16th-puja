import type React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Dust } from '../components/Dust';
import { Garland } from '../components/Garland';
import { Grain } from '../components/Grain';
import { Label } from '../components/Label';
import { Petals } from '../components/Petals';
import { Scene } from '../components/Scene';
import { Words } from '../components/Words';
import { videoContent } from '../content.video';
import { content } from '../generated/content';
import { fadeUp, seg, sine } from '../lib/anim';
import { colors, E, fonts, u } from '../theme';

const DIYA_CY = u(200);
const LINE_W = u(342);
const NUM_SIZE = 100;
const NUM_CY = [u(353), u(492)];

const Diya: React.FC<{ frame: number }> = ({ frame }) => {
  const p = seg(frame, 10, 36, E.out);
  const lit = frame >= 10;
  const flameY = frame < 36 ? p : 1 + 0.04 * sine(frame, 17);
  const flameX = frame < 36 ? 0.6 + 0.4 * p : 1 + 0.03 * sine(frame, 23);
  const flameSkew = frame < 36 ? 0 : 2 * sine(frame, 31);
  const glowOp = !lit ? 0 : frame < 36 ? p : 0.85 + 0.1 * sine(frame, 19);
  const glowScale = 0.6 + 0.4 * p;
  const flameStyle = {
    transformOrigin: '50px 44px',
    transformBox: 'view-box',
    transform: `scaleX(${flameX}) scaleY(${flameY}) skewX(${flameSkew}deg)`,
    opacity: lit ? 1 : 0,
  } as React.CSSProperties;
  const glowStyle = {
    transformOrigin: '50px 44px',
    transformBox: 'view-box',
    transform: `scale(${glowScale})`,
    opacity: glowOp,
  } as React.CSSProperties;

  return (
    <svg viewBox="0 0 100 80" width={420} height={336} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id="diya-glow-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFB62E" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#F29A1F" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#F29A1F" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="diya-brass-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F0D58A" />
          <stop offset="45%" stopColor="#C9A24B" />
          <stop offset="100%" stopColor="#9A7425" />
        </linearGradient>
        <linearGradient id="diya-rim-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F0D58A" />
          <stop offset="100%" stopColor="#C9A24B" />
        </linearGradient>
      </defs>
      <g id="diya-glow" className="glow" style={glowStyle}>
        <circle cx="50" cy="24" r="22" fill="url(#diya-glow-grad)" />
      </g>
      <g id="diya-flame" className="flame" style={flameStyle}>
        <path id="diya-flame-outer" d="M 50,42 C 41,39 36,30 38,22 C 40,14 47,8 50,4 C 53,8 60,14 62,22 C 64,30 59,39 50,42 Z" fill="#FFB62E" />
        <path id="diya-flame-inner" d="M 50,41 C 45,38 42,32 43,25 C 44,19 48,14 50,10 C 52,14 56,19 57,25 C 58,32 55,38 50,41 Z" fill="#FBF6EC" />
      </g>
      <g id="diya-bowl" className="bowl">
        <path id="diya-wick" d="M 50,44 Q 50,39 51,37" stroke="#AD5E46" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path id="diya-bowl-body" d="M 14,46 C 14,60 36,65 44,65 L 42,72 L 32,74 L 32,77 L 68,77 L 68,74 L 58,72 L 56,65 C 64,65 86,60 86,46 Z" fill="url(#diya-brass-grad)" stroke="#D98F78" strokeWidth="1.5" strokeLinejoin="round" />
        <ellipse id="diya-bowl-rim" cx="50" cy="46" rx="36" ry="6" fill="url(#diya-rim-grad)" stroke="#D98F78" strokeWidth="1.5" />
        <ellipse id="diya-bowl-inner-pool" cx="50" cy="46" rx="30" ry="4" fill="#9A7425" opacity="0.6" />
        <path id="diya-engraving-mid" d="M 50,49 Q 50,60 50,63" stroke="#D98F78" strokeWidth="1.2" fill="none" />
        <path id="diya-engraving-left" d="M 34,49 Q 38,58 44,63" stroke="#D98F78" strokeWidth="1.2" fill="none" />
        <path id="diya-engraving-right" d="M 66,49 Q 62,58 56,63" stroke="#D98F78" strokeWidth="1.2" fill="none" />
        <line id="diya-base-line" x1="33" y1="74" x2="67" y2="74" stroke="#D98F78" strokeWidth="1.2" />
        <circle id="diya-jewel-1" cx="44" cy="75.5" r="1" fill="#D81B72" />
        <circle id="diya-jewel-2" cx="50" cy="75.5" r="1" fill="#D81B72" />
        <circle id="diya-jewel-3" cx="56" cy="75.5" r="1" fill="#D81B72" />
      </g>
    </svg>
  );
};

const Center: React.FC<{ y: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ y, children, style }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, top: y, transform: 'translateY(-50%)', textAlign: 'center', ...style }}>
    {children}
  </div>
);

export const SceneRsvp: React.FC = () => {
  const frame = useCurrentFrame();
  const sandP = seg(frame, 170, 200, E.light);
  const rsvpOut = 1 - seg(frame, 170, 190, E.out);
  const rsvpLift = -u(12) * seg(frame, 170, 190, E.out);
  const diyaOut = 1 - seg(frame, 178, 196, E.out);
  const poolOp = seg(frame, 10, 36, E.out);
  const finalFade = 1 - seg(frame, 290, 305, E.light);
  const contacts = content.rsvp.contacts as Array<{ name?: string; phone: string }>;
  const siteUrl = videoContent.siteUrl;

  return (
    <Scene id="rsvp" background={colors.ivory}>
      <AbsoluteFill style={{ background: colors.sand, opacity: sandP, pointerEvents: 'none' }} />

      <div style={{ opacity: finalFade }}>
        <Dust count={12} seed="rsvp" />
        <Petals count={8} seed="rsvp" />

        {/* RSVP half */}
        <div style={{ opacity: rsvpOut, transform: `translateY(${rsvpLift}px)` }}>
          <Center y={u(109)}>
            <Label style={{ color: 'rgba(35,43,37,.74)' }}>{content.rsvp.label}</Label>
          </Center>

          {contacts.map((c, i) => {
            const from = 34 + i * 18;
            return (
              <div key={i}>
                <div
                  style={{
                    position: 'absolute',
                    left: (1080 - LINE_W) / 2,
                    top: NUM_CY[i] - NUM_SIZE / 2 - u(20),
                    width: LINE_W,
                    height: 1,
                    background: 'rgba(35,43,37,.16)',
                    transform: `scaleX(${seg(frame, from, from + 18, E.out)})`,
                    transformOrigin: 'left center',
                  }}
                />
                <Center y={NUM_CY[i]}>
                  <div
                    style={{
                      fontFamily: fonts.display,
                      fontWeight: 500,
                      fontSize: NUM_SIZE,
                      lineHeight: 1,
                      letterSpacing: '.01em',
                      fontVariantNumeric: 'lining-nums',
                      color: colors.ink,
                      ...fadeUp(frame, from, 18, 14),
                    }}
                  >
                    {c.phone}
                  </div>
                </Center>
              </div>
            );
          })}

          <Center y={u(625)}>
            <div
              style={{
                fontFamily: fonts.display,
                fontStyle: 'italic',
                fontWeight: 400,
                fontSize: u(20),
                lineHeight: 1.4,
                color: 'rgba(35,43,37,.85)',
                ...fadeUp(frame, 90, 24, 14),
              }}
            >
              {content.rsvp.thanks}
            </div>
          </Center>
        </div>

        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: DIYA_CY + u(44),
            width: u(280),
            height: u(90),
            transform: 'translate(-50%,-50%)',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(245,183,78,.35) 0, rgba(245,183,78,0) 70%)',
            opacity: poolOp,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: DIYA_CY,
            width: 420,
            transform: `translate(-50%,-50%) translateY(${rsvpLift}px)`,
            opacity: diyaOut,
          }}
        >
          <Diya frame={frame} />
        </div>

        {/* Closing half */}
        <Garland from={170} />

        <Center y={u(290)}>
          <div
            style={{
              fontFamily: fonts.display,
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: u(20),
              lineHeight: 1.3,
              color: 'rgba(35,43,37,.85)',
              ...fadeUp(frame, 184, 27, 14),
            }}
          >
            {content.closing.blessing}
          </div>
        </Center>

        <Center y={u(337)}>
          <div
            style={{
              fontFamily: fonts.display,
              fontWeight: 500,
              fontSize: u(44),
              lineHeight: 1.05,
              color: colors.ink,
            }}
          >
            <Words text={content.closing.family.pre} from={190} stagger={6} />
            {'\u00a0'}
            <Words text={content.closing.family.accent} from={196} stagger={6} style={{ fontStyle: 'italic', color: colors.saffronDeep }} />
            {'\u00a0'}
            <Words text={content.closing.family.post} from={202} stagger={6} />
          </div>
        </Center>

        <Center y={u(393)}>
          <div style={fadeUp(frame, 216, 24, 12)}>
            <Label style={{ color: 'rgba(35,43,37,.8)' }}>{content.closing.eventLine}</Label>
          </div>
        </Center>

        <Center y={u(414)}>
          <div style={fadeUp(frame, 222, 24, 12)}>
            <Label style={{ color: 'rgba(35,43,37,.8)' }}>{content.closing.dateLine}</Label>
          </div>
        </Center>

        <Center y={u(556)}>
          <div style={fadeUp(frame, 234, 24, 12)}>
            <Label style={{ color: 'rgba(35,43,37,.74)' }}>{content.closing.thanks}</Label>
          </div>
        </Center>

        {siteUrl ? (
          <Center y={u(580)}>
            <div style={fadeUp(frame, 246, 24, 12)}>
              <Label style={{ color: 'rgba(35,43,37,.74)' }}>{siteUrl}</Label>
            </div>
          </Center>
        ) : null}

        <Grain />
      </div>
    </Scene>
  );
};
