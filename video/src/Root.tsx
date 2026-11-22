import React from 'react';
import { Composition } from 'remotion';
import './fonts';
import { FontTest } from './FontTest';
import { Invite } from './Invite';
import { FPS, HEIGHT, WIDTH, totalFrames } from './config';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="FontTest"
        component={FontTest}
        width={WIDTH}
        height={HEIGHT}
        fps={FPS}
        durationInFrames={90}
      />
      <Composition
        id="Invite"
        component={Invite}
        width={WIDTH}
        height={HEIGHT}
        fps={FPS}
        durationInFrames={totalFrames()}
      />
    </>
  );
};
