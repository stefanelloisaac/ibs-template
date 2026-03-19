import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { InfraNavigation } from './infra/infra-navigation';
import { apiQueryClient } from '@/core/api';
import { ErrorProvider } from '@/core/error';
import { PermissionProvider } from '@/core/permission';
import { SessionProvider } from '@/core/session';
import { SocketProvider } from '@/core/socket';
import { TenantProvider } from '@/core/tenant';
import { ThemeProvider } from '@/core/theme';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorProvider>
      <InfraNavigation>
        <TenantProvider>
          <ThemeProvider>
            <QueryClientProvider client={apiQueryClient}>
              <SessionProvider>
                <PermissionProvider>
                  <SocketProvider>{children}</SocketProvider>
                </PermissionProvider>
              </SessionProvider>
            </QueryClientProvider>
          </ThemeProvider>
        </TenantProvider>
      </InfraNavigation>
    </ErrorProvider>
  );
}
