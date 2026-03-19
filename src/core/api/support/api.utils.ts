import { apiResolveBaseUrl } from './api.config';
import type { ApiBuildUrlOptions } from './api.types';

export function apiBuildUrl(route: string, options?: ApiBuildUrlOptions) {
  const resolvedPath = route.replace(/\{([^}]+)\}/g, (_, key: string) => {
    const value = options?.path?.[key];

    if (value === undefined || value === null) {
      throw new Error(`Missing path param: ${key}`);
    }

    return encodeURIComponent(String(value));
  });

  const normalizedRoute = resolvedPath.replace(/^\/+/, '');
  const normalizedBase = apiResolveBaseUrl().endsWith('/') ? apiResolveBaseUrl() : `${apiResolveBaseUrl()}/`;

  const url = new URL(normalizedRoute, normalizedBase);

  for (const [key, value] of Object.entries(options?.query ?? {})) {
    appendQueryValue(url.searchParams, key, value);
  }

  return url.toString();
}

function appendQueryValue(searchParams: URLSearchParams, key: string, value: unknown) {
  if (value === undefined || value === null) {
    return;
  }

  if (Array.isArray(value)) {
    for (const entry of value) {
      appendQueryValue(searchParams, key, entry);
    }
    return;
  }

  searchParams.append(key, String(value));
}
