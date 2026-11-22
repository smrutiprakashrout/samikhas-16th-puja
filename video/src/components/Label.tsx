import type React from 'react';
import { useCurrentFrame } from 'remotion';
import { fadeUp } from '../lib/anim';
import { colors, fonts, u } from '../theme';

type LabelProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
  from?: number;
};

export const Label: React.FC<LabelProps> = ({ children, style, from }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        fontFamily: fonts.sans,
        fontSize: u(11),
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '.24em',
        color: colors.ink,
        opacity: 0.74,
        ...(from === undefined ? {} : fadeUp(frame, from)),
        ...style,
      }}
    >
      {children}
    </div>
  );
};
