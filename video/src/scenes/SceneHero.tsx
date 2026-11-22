import type React from 'react';
import { Scene } from '../components/Scene';
import { Column } from '../components/Column';
import { Label } from '../components/Label';
import { colors } from '../theme';

export const SceneHero: React.FC = () => (
  <Scene id="hero" background={colors.sand}>
    <Column style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <Label>hero · 190</Label>
    </Column>
  </Scene>
);
