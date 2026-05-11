import { View } from 'react-native';

import { tokens } from '@/constants/tokens';

export function AmbientBackground() {
  return (
    <>
      <View
        pointerEvents="none"
        className="absolute -right-[40px] -top-[20px] h-[280px] w-[280px] rounded-pill opacity-90"
        style={{ backgroundColor: tokens.effects.topGlow }}
      />
      <View
        pointerEvents="none"
        className="absolute -bottom-[80px] -left-[40px] h-[240px] w-[240px] rounded-pill opacity-90"
        style={{ backgroundColor: tokens.effects.bottomGlow }}
      />
    </>
  );
}
