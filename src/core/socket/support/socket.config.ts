export function socketResolveBaseUrl(): string {
  const baseUrl = import.meta.env.VITE_SOCKET_BASE_URL as string | undefined;

  if (!baseUrl) {
    throw new Error('VITE_SOCKET_BASE_URL is not set. Define it in your .env file.');
  }

  return baseUrl;
}
