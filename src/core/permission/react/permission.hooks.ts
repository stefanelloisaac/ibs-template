import { useContext } from 'react';
import type { PermissionContextState } from '../support/permission.types';
import { PermissionContext } from './permission.context';

export function usePermission(): PermissionContextState {
  const context = useContext(PermissionContext);

  if (!context) {
    throw new Error('usePermission must be used within a PermissionProvider');
  }

  return context;
}
