import type React from 'react';
import { Scene } from '../components/Scene';
import { Column } from '../components/Column';
import { Label } from '../components/Label';
import { colors } from '../theme';

export const SceneRsvp: React.FC = () => (
  <Scene id="rsvp" background={colors.ivory}>
    <Column style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <Label>rsvp · 305</Label>
    </Column>
  </Scene>
);
