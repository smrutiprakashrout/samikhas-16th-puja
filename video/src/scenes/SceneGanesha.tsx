import type React from 'react';
import { Scene } from '../components/Scene';
import { Column } from '../components/Column';
import { Label } from '../components/Label';
import { colors } from '../theme';

export const SceneGanesha: React.FC = () => (
  <Scene id="ganesha" background={colors.sand}>
    <Column style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <Label>ganesha · 270</Label>
    </Column>
  </Scene>
);
