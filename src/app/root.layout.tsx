import { useMemo } from 'react';
import { appNavigationItems, resolveAppNavigationItems } from './navigation/navigation';
import { RouteMetadata } from './routing/route-metadata';
import { RoutingProgress } from './routing/routing-progress';
import { useSession } from '@/core/session';
import { LayoutEngine } from '@/shell/layout/layout.engine';

export default function RootLayout() {
  const { isHydrated, status } = useSession();
  const visibleNavigationItems = useMemo(
    () => resolveAppNavigationItems(appNavigationItems, { isHydrated, status }),
    [isHydrated, status],
  );

  return (
    <>
      <RouteMetadata />
      <RoutingProgress />
      <LayoutEngine navigationItems={visibleNavigationItems} />
    </>
  );
}
