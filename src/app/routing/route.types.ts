import type { PermissionRule } from '@/core/permission';

export type AppRouteMetaValue = string | ((loaderData: unknown) => string);

export interface AppRouteMeta {
  title?: AppRouteMetaValue;
  description?: AppRouteMetaValue;
}

export interface AppRouteHandle {
  meta?: AppRouteMeta;
  permission?: PermissionRule;
}
