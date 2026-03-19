import { createContext } from 'react';
import type { PermissionContextState } from '../support/permission.types';

export const PermissionContext = createContext<PermissionContextState | null>(null);
