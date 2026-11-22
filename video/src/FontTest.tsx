import React from 'react';
import { AbsoluteFill, Html5Audio, staticFile, useCurrentFrame } from 'remotion';
import { videoContent } from './content.video';
import { content } from './generated/content';
import { fontFamilies } from './fonts';

const IVORY = '#FBF3E4';
const INK = '#232B25';
const SAFFRON = '#B25D17';

export const FontTest: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: IVORY,
        color: INK,
        fontFamily: fontFamilies.display,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Html5Audio src={staticFile('audio/bgm.mp3')} volume={0.5} />
      <div
        style={{
          width: 887,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 140, fontWeight: 500, lineHeight: 1.1 }}>
          {videoContent.satya.titleA}{' '}
          <span style={{ fontStyle: 'italic', color: SAFFRON }}>{videoContent.satya.titleB}</span>
        </div>
        <div style={{ fontSize: 300, fontWeight: 500, color: SAFFRON, lineHeight: 1.05 }}>
          {videoContent.satya.time}
        </div>
        <div
          style={{
            fontFamily: fontFamilies.sans,
            fontSize: 40,
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '.24em',
            marginTop: 20,
          }}
        >
          {content.event.dateLong}
        </div>
        <div
          style={{
            fontFamily: fontFamilies.odia,
            fontWeight: 600,
            fontSize: 70,
            lineHeight: 1.35,
            marginTop: 48,
          }}
        >
          <div>{content.invocation.sanskrit}</div>
          {content.shloka.lines.map((line: string, i: number) => (
            <div key={i}>{line}</div>
          ))}
        </div>
        <div
          style={{
            fontFamily: fontFamilies.sans,
            fontWeight: 400,
            fontSize: 36,
            marginTop: 48,
          }}
        >
          frame: {frame}
        </div>
      </div>
    </AbsoluteFill>
  );
};
