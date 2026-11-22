import type React from 'react';
import { useCurrentFrame } from 'remotion';
import { fadeUp } from '../lib/anim';

type WordsProps = {
  text: string;
  from: number;
  stagger?: number;
  style?: React.CSSProperties;
};

export const Words: React.FC<WordsProps> = ({ text, from, stagger = 1.4, style }) => {
  const frame = useCurrentFrame();
  const parts = text.split(' ');
  return (
    <span style={style}>
      {parts.map((word, i) => (
        <span key={i} style={{ display: 'inline-block', ...fadeUp(frame, from + i * stagger) }}>
          {word}
          {i < parts.length - 1 ? '\u00a0' : ''}
        </span>
      ))}
    </span>
  );
};
