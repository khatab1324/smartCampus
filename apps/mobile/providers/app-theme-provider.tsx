import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';

import {
  AppColorScheme,
  AppThemePreference,
  AppColorTokens,
  getThemeChrome,
  getThemeColors,
  getThemeEffects,
} from '@/constants/tokens';

type AppThemeContextValue = {
  colorScheme: AppColorScheme;
  colors: AppColorTokens;
  chrome: ReturnType<typeof getThemeChrome>;
  effects: ReturnType<typeof getThemeEffects>;
  setColorScheme: (nextScheme: AppColorScheme) => Promise<void>;
  setThemePreference: (nextPreference: AppThemePreference) => Promise<void>;
  themePreference: AppThemePreference;
};

const STORAGE_KEY = '@smart-campus/theme-preference';

export const AppThemeContext = createContext<AppThemeContextValue | null>(null);

export function AppThemeProvider({ children }: PropsWithChildren) {
  const nativeColorScheme = useNativeColorScheme();
  const [themePreference, setStoredThemePreference] = useState<AppThemePreference>('system');

  useEffect(() => {
    let isActive = true;

    AsyncStorage.getItem(STORAGE_KEY).then((storedValue) => {
      if (!isActive) {
        return;
      }

      if (storedValue === 'dark' || storedValue === 'light' || storedValue === 'system') {
        setStoredThemePreference(storedValue);
      }
    });

    return () => {
      isActive = false;
    };
  }, []);

  const value = useMemo<AppThemeContextValue>(() => {
    const colorScheme: AppColorScheme =
      themePreference === 'system' ? (nativeColorScheme === 'dark' ? 'dark' : 'light') : themePreference;
    const colors = getThemeColors(colorScheme);

    return {
      chrome: getThemeChrome(colors),
      colorScheme,
      colors,
      effects: getThemeEffects(colors),
      setColorScheme: async (nextScheme) => {
        setStoredThemePreference(nextScheme);
        await AsyncStorage.setItem(STORAGE_KEY, nextScheme);
      },
      setThemePreference: async (nextPreference) => {
        setStoredThemePreference(nextPreference);
        await AsyncStorage.setItem(STORAGE_KEY, nextPreference);
      },
      themePreference,
    };
  }, [nativeColorScheme, themePreference]);

  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
}
