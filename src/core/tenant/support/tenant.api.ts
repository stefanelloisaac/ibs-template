import { tenantResolveHostname } from './tenant.config';
import type { TenantConfig } from './tenant.types';
import { apiRequest } from '@/core/api';

export async function tenantFetchConfig(): Promise<TenantConfig> {
  const hostname = tenantResolveHostname();

  return apiRequest<TenantConfig>(`/tenants/resolve?hostname=${encodeURIComponent(hostname)}`);
}
