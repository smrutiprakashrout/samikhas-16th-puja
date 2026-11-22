import type React from 'react';
import { Scene } from '../components/Scene';
import { Column } from '../components/Column';
import { Label } from '../components/Label';
import { colors } from '../theme';

export const SceneFamily: React.FC = () => (
  <Scene id="family" background={colors.ivory}>
    <Column style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <Label>family · 170</Label>
    </Column>
  </Scene>
);
