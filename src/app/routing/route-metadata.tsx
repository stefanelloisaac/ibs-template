import { useMemo } from 'react';
import { useMatches } from 'react-router';
import type { AppRouteHandle } from './route.types';
import { useTenant } from '@/core/tenant';

export function RouteMetadata() {
  const { config } = useTenant();
  const matches = useMatches();

  const activeMatch = useMemo(
    () =>
      [...matches].reverse().find((match) => {
        const meta = (match.handle as AppRouteHandle | undefined)?.meta;
        return meta?.title != null || meta?.description != null;
      }),
    [matches],
  );

  const { documentTitle, description } = useMemo(() => {
    const meta = (activeMatch?.handle as AppRouteHandle | undefined)?.meta;
    const data = activeMatch?.loaderData;
    const resolvedTitle = meta?.title ? (typeof meta.title === 'function' ? meta.title(data) : meta.title) : null;
    const resolvedDescription = meta?.description
      ? typeof meta.description === 'function'
        ? meta.description(data)
        : meta.description
      : null;

    return {
      documentTitle: resolvedTitle ? `${resolvedTitle} | ${config.appName}` : config.appName,
      description: resolvedDescription,
    };
  }, [activeMatch, config.appName]);

  return (
    <>
      <title>{documentTitle}</title>
      {description && <meta name='description' content={description} />}
    </>
  );
}
