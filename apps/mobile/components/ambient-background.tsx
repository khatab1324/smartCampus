import { StyleSheet, View } from 'react-native';

import { tokens } from '@/constants/tokens';

export function AmbientBackground() {
  return (
    <>
      <View pointerEvents="none" style={[styles.glow, styles.topGlow]} />
      <View pointerEvents="none" style={[styles.glow, styles.bottomGlow]} />
    </>
  );
}

const styles = StyleSheet.create({
  glow: {
    borderRadius: tokens.radii.pill,
    opacity: 0.9,
    position: 'absolute',
  },
  topGlow: {
    backgroundColor: tokens.effects.topGlow,
    height: 280,
    right: -40,
    top: -20,
    width: 280,
  },
  bottomGlow: {
    backgroundColor: tokens.effects.bottomGlow,
    bottom: -80,
    height: 240,
    left: -40,
    width: 240,
  },
});
