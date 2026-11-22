import type React from 'react';
import { Scene } from '../components/Scene';
import { Column } from '../components/Column';
import { Label } from '../components/Label';
import { colors } from '../theme';

export const SceneVenue: React.FC = () => (
  <Scene id="venue" background={colors.sand}>
    <Column style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <Label>venue · 160</Label>
    </Column>
  </Scene>
);
