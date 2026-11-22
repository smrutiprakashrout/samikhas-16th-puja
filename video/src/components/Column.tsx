import type React from 'react';
import { COL_W, COL_X } from '../theme';

type ColumnProps = {
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

export const Column: React.FC<ColumnProps> = ({ children, style }) => (
  <div style={{ position: 'absolute', left: COL_X, width: COL_W, top: 0, bottom: 0, ...style }}>
    {children}
  </div>
);
