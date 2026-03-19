import { permissionFetchUserPermissions } from '../support/permission.api';
import type { PermissionResourceState } from '../support/permission.types';
import { isApiError } from '@/core/api';

export function permissionCreateInitialResource(): PermissionResourceState {
  return {
    ownerKey: null,
    permissions: null,
    error: null,
  };
}

export function permissionResolveOwnerKey(
  isHydrated: boolean,
  isAuthenticated: boolean,
  userId?: string | null,
): string | null {
  if (!isHydrated || !isAuthenticated) {
    return null;
  }

  return userId ?? '__authenticated__';
}

export function permissionSelectCurrentResource(
  resource: PermissionResourceState,
  ownerKey: string | null,
): PermissionResourceState {
  if (resource.ownerKey !== ownerKey) {
    return {
      ownerKey,
      permissions: null,
      error: null,
    };
  }

  return resource;
}

export async function permissionResolveResource(ownerKey: string): Promise<PermissionResourceState> {
  try {
    const permissions = await permissionFetchUserPermissions();

    return {
      ownerKey,
      permissions,
      error: null,
    };
  } catch (error) {
    if (isApiError(error) && (error.status === 401 || error.status === 404)) {
      return {
        ownerKey,
        permissions: [],
        error: null,
      };
    }

    return {
      ownerKey,
      permissions: null,
      error: error instanceof Error ? error : new Error('Failed to resolve permissions'),
    };
  }
}
