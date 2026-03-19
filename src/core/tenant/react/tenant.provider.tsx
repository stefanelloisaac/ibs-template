import { useEffect, useState } from 'react';
import { tenantCreateInitialState, tenantResolveConfig } from '../runtime/tenant.bootstrap';
import type { TenantProviderProps } from '../support/tenant.types';
import { tenantApplyBranding } from '../support/tenant.utils';
import { TenantContext } from './tenant.context';

export function TenantProvider({ children }: TenantProviderProps) {
  const [state, setState] = useState(tenantCreateInitialState);
  const { config, isLoading } = state;

  useEffect(() => {
    if (!config) {
      return;
    }

    tenantApplyBranding(config);
  }, [config]);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    let isCurrent = true;

    void tenantResolveConfig().then((resolvedConfig) => {
      if (!isCurrent) {
        return;
      }

      setState({
        config: resolvedConfig,
        isLoading: false,
      });
    });

    return () => {
      isCurrent = false;
    };
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  if (!config) {
    throw new Error('Tenant configuration not available');
  }

  return <TenantContext.Provider value={{ config }}>{children}</TenantContext.Provider>;
}
