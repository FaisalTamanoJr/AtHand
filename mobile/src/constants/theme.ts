/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://unistyl.es/), etc.
 */


import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0F172A',
    background: '#F3F6FB',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#EAF0FB',
    textSecondary: '#64748B',
    border: '#E4E9F2',
    tint: '#1560E8',
    tintSoft: '#E7EFFE',
    onTint: '#FFFFFF',
    success: '#0E9F5B',
    successSoft: '#E3F7EC',
    warning: '#B45309',
    warningSoft: '#FEF3C7',
    danger: '#DC2626',
    dangerSoft: '#FEE4E2',
    highlight: '#FACC15',
    shadow: 'rgba(15, 23, 42, 0.07)',
  },
  dark: {
    text: '#F1F5F9',
    background: '#0B1220',
    backgroundElement: '#141D2F',
    backgroundSelected: '#1C2840',
    textSecondary: '#94A3B8',
    border: '#212C44',
    tint: '#4D8DFF',
    tintSoft: '#17284D',
    onTint: '#FFFFFF',
    success: '#34D399',
    successSoft: '#0F2E24',
    warning: '#FBBF24',
    warningSoft: '#3A2A0C',
    danger: '#F87171',
    dangerSoft: '#3B1518',
    highlight: '#FACC15',
    shadow: 'rgba(0, 0, 0, 0.35)',
  },
} as const;

/** CSS gradients for the blue hero header and promo cards (React Native `backgroundImage`). */
export const Gradients = {
  light: {
    hero: 'linear-gradient(160deg, #0B44C2 0%, #1666F0 100%)',
    promo: ['linear-gradient(120deg, #1560E8 0%, #5B4BEA 100%)', 'linear-gradient(120deg, #0891B2 0%, #1560E8 100%)', 'linear-gradient(120deg, #0E9F5B 0%, #0891B2 100%)'],
  },
  dark: {
    hero: 'linear-gradient(160deg, #0A2F86 0%, #1450C8 100%)',
    promo: ['linear-gradient(120deg, #1450C8 0%, #4B3DC9 100%)', 'linear-gradient(120deg, #0E7490 0%, #1450C8 100%)', 'linear-gradient(120deg, #0B7A47 0%, #0E7490 100%)'],
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

/** The custom tab bar sits below the screen, so tab screens only need breathing room. */
export const BottomTabInset = 16;
export const MaxContentWidth = 800;
