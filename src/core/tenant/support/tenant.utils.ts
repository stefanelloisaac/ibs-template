import type { TenantConfig } from './tenant.types';
import { themeApplyConfig } from '@/core/theme';

export function tenantApplyFavicon(faviconUrl: string) {
  const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (link) link.href = faviconUrl;
}

export function tenantApplyBranding(config: TenantConfig) {
  if (config.theme) themeApplyConfig(config.theme);
  tenantApplyFavicon(config.branding.faviconUrl);
}
