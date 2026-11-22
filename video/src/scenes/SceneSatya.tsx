import type React from 'react';
import { Scene } from '../components/Scene';
import { Column } from '../components/Column';
import { Label } from '../components/Label';
import { colors } from '../theme';

export const SceneSatya: React.FC = () => (
  <Scene id="satya" background={colors.ivory}>
    <Column style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <Label>satya · 200</Label>
    </Column>
  </Scene>
);
