import type React from 'react';
import { useCurrentFrame } from 'remotion';
import { createGarland } from '../generated/garland';
import { seg, sine } from '../lib/anim';
import { E, u } from '../theme';

const g = createGarland(7);
const markup = g.topGarland() + g.strand(26, 236, 6) + g.strand(364, 320, -6);

type GarlandProps = {
  from: number;
  dropDist?: number;
};

export const Garland: React.FC<GarlandProps> = ({ from, dropDist = 120 }) => {
  const frame = useCurrentFrame();
  const p = seg(frame, from, from + 30, E.out);
  const sway = sine(frame, 150) * 0.8;
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 1080,
        transform: `translateY(${-u(dropDist) * (1 - p)}px) rotate(${sway}deg)`,
        transformOrigin: '50% 0%',
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={1080}
        height={1080}
        viewBox="0 0 390 390"
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    </div>
  );
};
