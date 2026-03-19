// --- domain ---

export type ApiPrimitive = string | number | boolean;
export type ApiHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type ApiRegistryEntry = {
  method: ApiHttpMethod;
  route: `/${string}`;
};

export type ApiBuildUrlOptions = {
  path?: Record<string, ApiPrimitive>;
  query?: Record<string, unknown>;
};

// --- runtime ---

export type ApiRequestInit = {
  method?: ApiHttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  signal?: AbortSignal;
};

export type ApiInfraEvent =
  | {
      type: 'unauthorized';
      source: 'api';
      context: ApiErrorContext;
    }
  | {
      type: 'forbidden';
      source: 'api';
      context: ApiErrorContext;
    }
  | {
      type: 'not_found';
      source: 'api';
      context: ApiErrorContext;
    };

// --- errors ---

export type ApiErrorBody = {
  message?: string;
  code?: string;
  errors?: Array<{ field?: string; message: string }>;
  [key: string]: unknown;
};

export type ApiErrorInit = {
  status: number;
  statusText: string;
  url: string;
  body: ApiErrorBody | null;
  retryAfter?: number;
};

export type ApiErrorContext = 'query' | 'mutation';
