import type React from 'react';
import { Html5Audio, Sequence, staticFile } from 'remotion';
import { SafeZones } from './components/SafeZones';
import { BGM_START_SEC, FPS, SCENES, sceneStart, totalFrames } from './config';
import { SceneDate } from './scenes/SceneDate';
import { SceneFamily } from './scenes/SceneFamily';
import { SceneGanesha } from './scenes/SceneGanesha';
import { SceneGate } from './scenes/SceneGate';
import { SceneHero } from './scenes/SceneHero';
import { SceneInvitation } from './scenes/SceneInvitation';
import { SceneRsvp } from './scenes/SceneRsvp';
import { SceneSatya } from './scenes/SceneSatya';
import { SceneVenue } from './scenes/SceneVenue';

const COMPONENTS: Record<string, React.FC> = {
  gate: SceneGate,
  ganesha: SceneGanesha,
  hero: SceneHero,
  invitation: SceneInvitation,
  satya: SceneSatya,
  family: SceneFamily,
  date: SceneDate,
  venue: SceneVenue,
  rsvp: SceneRsvp,
};

const TOTAL = totalFrames();
const bgmVolume = (frame: number) => {
  const fadeIn = Math.min(1, Math.max(0, frame / 45));
  const fadeOut = Math.min(1, Math.max(0, (TOTAL - frame) / 60));
  return 0.6 * Math.min(fadeIn, fadeOut);
};

export const Invite: React.FC = () => (
  <>
    <Html5Audio src={staticFile('audio/bgm.mp3')} trimBefore={BGM_START_SEC * FPS} volume={bgmVolume} />
    {SCENES.map((s, i) => {
      const Component = COMPONENTS[s.id];
      return (
        <Sequence key={s.id} from={sceneStart(i)} durationInFrames={s.length}>
          <Component />
        </Sequence>
      );
    })}
    <SafeZones />
  </>
);
