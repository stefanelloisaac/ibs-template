import type { ThemeConfig, ThemeMode } from './theme.types';

export function themeResolveStoredMode(storageKey: string, fallback: ThemeMode): ThemeMode {
  const storedMode = localStorage.getItem(storageKey);

  if (storedMode === 'light' || storedMode === 'dark') {
    return storedMode;
  }

  return fallback;
}

function themeInjectFont(url: string) {
  document.querySelector('link[data-theme-font]')?.remove();

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  link.setAttribute('data-theme-font', '');
  document.head.appendChild(link);
}

export function themeApplyConfig(config: ThemeConfig) {
  const root = document.documentElement.style;

  root.setProperty('--primary', config.primary);
  root.setProperty('--primary-foreground', config.primaryForeground);
  root.setProperty('--ring', config.primary);
  root.setProperty('--sidebar-primary', config.primary);
  root.setProperty('--sidebar-primary-foreground', config.primaryForeground);
  root.setProperty('--sidebar-ring', config.primary);
  root.setProperty('--chart-1', config.primary);

  if (config.radius) root.setProperty('--radius', config.radius);

  const font = config.fontFamily ? { family: config.fontFamily, url: config.fontUrl } : null;

  if (font) {
    root.setProperty('--font-sans', font.family);
    if (font.url) themeInjectFont(font.url);
  }
}
