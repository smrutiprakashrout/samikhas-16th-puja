import type React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { Dust } from '../components/Dust';
import { Garland } from '../components/Garland';
import { Grain } from '../components/Grain';
import { Label } from '../components/Label';
import { Petals } from '../components/Petals';
import { Scene } from '../components/Scene';
import { Vignette } from '../components/Vignette';
import { content } from '../generated/content';
import { fadeUp, seg, sine, wipe } from '../lib/anim';
import { colors, E, fonts, u } from '../theme';
import { haloSvg, lotusBack, lotusFront } from './ganeshaArt';

const GW = u(270);
const GH = (GW * 1190) / 800;
const HG_TOP = u(210);
const HG_LIFT = u(34) * 0.84;
const HG_SCALE = 0.66;

const svgFull = (s: string) => s.replace('<svg ', '<svg style="width:100%;height:100%;overflow:visible" ');
const HALO = svgFull(haloSvg());
const LOTUS_BACK = svgFull(lotusBack());
const LOTUS_FRONT = svgFull(lotusFront());

export const SceneGanesha: React.FC = () => {
  const frame = useCurrentFrame();

  const floodOut = 1 - seg(frame, 0, 40, E.out);
  const haloDraw = 1 - seg(frame, 20, 70, E.out);
  const spin = (frame / 1800) * 360;
  const rise = seg(frame, 36, 76, E.out);
  const float = frame > 76 ? sine(frame, 120) * u(3) : 0;
  const glowPulse = 1 + 0.08 * sine(frame, 120);
  const lotusP = seg(frame, 50, 70, E.out);
  const meaningP = seg(frame, 186, 210, E.out);

  return (
    <Scene id="ganesha" background={colors.sand}>
      <AbsoluteFill>
        <AbsoluteFill
          style={{ background: colors.flood, opacity: floodOut, zIndex: 1 }}
        />

        {/* glow behind Ganesha */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: HG_TOP + HG_LIFT + GH * HG_SCALE * 0.45,
            width: GW * 1.6,
            aspectRatio: '1',
            transform: `translate(-50%,-50%) scale(${glowPulse})`,
            borderRadius: '50%',
            zIndex: 2,
            background: 'radial-gradient(circle,rgba(245,183,78,.45) 0,rgba(245,183,78,0) 70%)',
          }}
        />

        <Dust count={24} seed="ganesha" />
        <Petals count={8} seed="ganesha" from={40} />
        <Vignette />

        <div style={{ position: 'absolute', top: u(104), left: 0, right: 0, textAlign: 'center', zIndex: 12, ...fadeUp(frame, 20) }}>
          <Label style={{ color: 'rgba(35,43,37,.74)' }}>{content.invocation.label}</Label>
        </div>
        <div
          style={{
            position: 'absolute',
            top: u(126),
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: 12,
            fontFamily: fonts.odia,
            fontWeight: 600,
            fontSize: u(24),
            lineHeight: 1.5,
            color: colors.ink,
            ...fadeUp(frame, 28),
          }}
        >
          {content.invocation.sanskrit}
        </div>

        {/* Ganesha group */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: HG_TOP,
            width: GW,
            height: GH,
            marginLeft: -GW / 2,
            zIndex: 10,
            transformOrigin: '50% 0%',
            transform: `translateY(${HG_LIFT + u(40) * (1 - rise) + float}px) scale(${HG_SCALE * (0.94 + 0.06 * rise)})`,
            opacity: rise,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '30%',
              width: '158%',
              aspectRatio: '1',
              transform: 'translate(-50%,-50%)',
              ['--halo-dash' as string]: haloDraw,
              ['--halo-spin' as string]: `${spin}deg`,
              ['--halo-spin-r' as string]: `${-spin}deg`,
              ['--spin-op' as string]: seg(frame, 48, 70),
            }}
            dangerouslySetInnerHTML={{ __html: HALO }}
          />
          <div
            style={{
              position: 'absolute',
              left: '-10%',
              width: '120%',
              top: GH - GW * 1.2 * 0.613 * 0.478,
              zIndex: -1,
              opacity: lotusP,
              transform: `scaleY(${0.6 + 0.4 * lotusP})`,
              transformOrigin: '50% 100%',
            }}
            dangerouslySetInnerHTML={{ __html: LOTUS_BACK }}
          />
          <Img
            src={staticFile(content.shloka.image.replace(/^\//, ''))}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              filter: 'drop-shadow(0 10px 14px rgba(110,76,40,.18))',
              scale: 1.13,
              transformOrigin: '94.33% 193.76%'
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '-10%',
              width: '120%',
              top: GH - GW * 1.2 * 0.613 * 0.478,
              zIndex: 2,
              opacity: lotusP,
              transform: `scaleY(${0.6 + 0.4 * lotusP})`,
              transformOrigin: '50% 100%',
            }}
            dangerouslySetInnerHTML={{ __html: LOTUS_FRONT }}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            top: u(468),
            left: 0,
            right: 0,
            zIndex: 12,
            display: 'grid',
            gap: u(6),
            textAlign: 'center',
            fontFamily: fonts.odia,
            fontWeight: 600,
            fontSize: u(22),
            lineHeight: 1.5,
            color: colors.ink,
          }}
        >
          {content.shloka.lines.map((line: string, i: number) => (
            <div key={i} style={wipe(frame, 84 + i * 22, 24)}>
              {line}
            </div>
          ))}
        </div>

        <div
          style={{
            position: 'absolute',
            top: u(668),
            left: '50%',
            width: u(290),
            marginLeft: -u(290) / 2,
            zIndex: 12,
            textAlign: 'center',
            fontFamily: fonts.display,
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: u(19),
            lineHeight: 1.42,
            color: 'rgba(35,43,37,.8)',
            ...fadeUp(frame, 186, 24, 20, E.out),
            opacity: meaningP,
          }}
        >
          {content.shloka.meaning}
        </div>

        <Garland from={8} />
        <Grain />
      </AbsoluteFill>
    </Scene>
  );
};
