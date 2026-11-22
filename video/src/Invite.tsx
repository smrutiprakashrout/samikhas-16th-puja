import type React from 'react';
import { Sequence } from 'remotion';
import { SafeZones } from './components/SafeZones';
import { SCENES, sceneStart } from './config';
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

export const Invite: React.FC = () => (
  <>
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
