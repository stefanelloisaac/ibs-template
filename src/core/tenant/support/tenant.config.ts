export function tenantResolveHostname(): string {
  return window.location.hostname;
}

export function tenantShouldUseFallbackConfig(hostname = tenantResolveHostname()): boolean {
  return hostname === 'localhost' || hostname === '127.0.0.1';
}
