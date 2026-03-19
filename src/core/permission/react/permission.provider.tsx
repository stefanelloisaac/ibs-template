import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  permissionCreateInitialResource,
  permissionResolveOwnerKey,
  permissionResolveResource,
  permissionSelectCurrentResource,
} from '../runtime/permission.runtime';
import { PERMISSION_EMPTY } from '../support/permission.constants';
import type { PermissionProviderProps, PermissionResourceState } from '../support/permission.types';
import { permissionCan, permissionCannot, permissionCreateSet } from '../support/permission.utils';
import { PermissionContext } from './permission.context';
import { useSession } from '@/core/session';

export function PermissionProvider({ children }: PermissionProviderProps) {
  const { status, isAuthenticated, isHydrated, user } = useSession();
  const [resource, setResource] = useState<PermissionResourceState>(permissionCreateInitialResource);
  const ownerKey = permissionResolveOwnerKey(isHydrated, isAuthenticated, user?.id);

  useEffect(() => {
    if (!ownerKey || status === 'loading') {
      return;
    }

    let isCurrent = true;

    void permissionResolveResource(ownerKey).then((nextResource) => {
      if (!isCurrent) {
        return;
      }

      setResource(nextResource);
    });

    return () => {
      isCurrent = false;
    };
  }, [ownerKey, status]);

  const currentResource = permissionSelectCurrentResource(resource, ownerKey);
  const { permissions: currentPermissions, error: currentError } = currentResource;

  const set = useMemo(() => {
    const nextPermissions = ownerKey ? currentPermissions : [];
    return nextPermissions ? permissionCreateSet(nextPermissions) : PERMISSION_EMPTY;
  }, [currentPermissions, ownerKey]);

  const can = useCallback((action: string, subject: string) => permissionCan(set, action, subject), [set]);
  const cannot = useCallback((action: string, subject: string) => permissionCannot(set, action, subject), [set]);
  const value = useMemo(() => ({ can, cannot }), [can, cannot]);

  if (ownerKey && currentError) {
    throw currentError;
  }

  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
}
