import { Platform, Vibration } from 'react-native';

// Light haptic feedback wrapper that gracefully degrades
// Uses the built-in Vibration API as a lightweight approach

export function hapticLight(): void {
  if (Platform.OS === 'ios') {
    // iOS has built-in haptic engine - short vibration
    Vibration.vibrate(10);
  }
}

export function hapticMedium(): void {
  Vibration.vibrate(Platform.OS === 'ios' ? 20 : 30);
}

export function hapticSuccess(): void {
  if (Platform.OS === 'ios') {
    Vibration.vibrate([0, 10, 50, 10]);
  } else {
    Vibration.vibrate(20);
  }
}

export function hapticError(): void {
  Vibration.vibrate(Platform.OS === 'ios' ? [0, 30, 30, 30] : [0, 50, 50, 50]);
}
