import type React from 'react';
import { Scene } from '../components/Scene';
import { Column } from '../components/Column';
import { Label } from '../components/Label';
import { colors } from '../theme';

export const SceneGate: React.FC = () => (
  <Scene id="gate" background={colors.sand}>
    <Column style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <Label>gate · 210</Label>
    </Column>
  </Scene>
);
