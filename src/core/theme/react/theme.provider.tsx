import { useEffect, useMemo, useState } from 'react';
import type { ThemeMode, ThemeProviderProps } from '../support/theme.types';
import { themeResolveStoredMode } from '../support/theme.utils';
import { ThemeContext } from './theme.context';

export function ThemeProvider({
  children,
  defaultMode = 'light',
  storageKey = 'stefanello-app-theme',
}: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(() => themeResolveStoredMode(storageKey, defaultMode));

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');
    root.classList.add(mode);
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      setMode: (nextMode: ThemeMode) => {
        localStorage.setItem(storageKey, nextMode);
        setMode(nextMode);
      },
    }),
    [mode, storageKey],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
