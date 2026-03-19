import { tenantFetchConfig } from '../support/tenant.api';
import { tenantResolveHostname, tenantShouldUseFallbackConfig } from '../support/tenant.config';
import type { TenantConfig, TenantProviderState } from '../support/tenant.types';

function tenantCreateFallbackConfig(hostname = tenantResolveHostname()): TenantConfig {
  return {
    slug: 'local',
    appName: 'Stefanello App',
    branding: {
      logoUrl: '',
      logoIconUrl: '',
      faviconUrl: '',
    },
    layout: {
      sidebarPosition: 'left',
      sidebarDefaultCollapsed: false,
      showFooter: true,
      footerText: hostname,
      showSearchbar: false,
    },
  };
}

export function tenantCreateInitialState(): TenantProviderState {
  if (tenantShouldUseFallbackConfig()) {
    return {
      config: tenantCreateFallbackConfig(),
      isLoading: false,
    };
  }

  return {
    config: null,
    isLoading: true,
  };
}

export async function tenantResolveConfig(): Promise<TenantConfig> {
  try {
    return await tenantFetchConfig();
  } catch (error) {
    console.warn('[Tenant] Failed to resolve tenant. Using fallback config.', error);
    return tenantCreateFallbackConfig();
  }
}
