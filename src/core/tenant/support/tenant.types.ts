import type { ReactNode } from 'react';
import type { ThemeConfig } from '@/core/theme';

// --- domain ---

export interface TenantBranding {
  logoUrl: string;
  logoIconUrl: string;
  faviconUrl: string;
}

export interface TenantLayout {
  sidebarPosition: 'left' | 'right' | 'top';
  sidebarDefaultCollapsed: boolean;
  showFooter: boolean;
  footerText?: string;
  showSearchbar: boolean;
}

export interface TenantConfig {
  slug: string;
  appName: string;
  branding: TenantBranding;
  theme?: ThemeConfig;
  layout: TenantLayout;
}

// --- runtime ---

export type TenantProviderState = {
  config: TenantConfig | null;
  isLoading: boolean;
};

// --- context ---

export interface TenantContextState {
  config: TenantConfig;
}

// --- provider ---

export type TenantProviderProps = {
  children: ReactNode;
};
