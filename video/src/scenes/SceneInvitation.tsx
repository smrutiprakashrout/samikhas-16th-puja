import type React from 'react';
import { Scene } from '../components/Scene';
import { Column } from '../components/Column';
import { Label } from '../components/Label';
import { colors } from '../theme';

export const SceneInvitation: React.FC = () => (
  <Scene id="invitation" background={colors.ivory}>
    <Column style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <Label>invitation · 190</Label>
    </Column>
  </Scene>
);
