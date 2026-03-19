import { createContext } from 'react';
import type { TenantContextState } from '../support/tenant.types';

export const TenantContext = createContext<TenantContextState | null>(null);
