export function apiResolveBaseUrl(): string {
  const baseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;

  if (!baseUrl) {
    throw new Error('VITE_API_BASE_URL is not set. Define it in your .env file.');
  }

  return baseUrl;
}
