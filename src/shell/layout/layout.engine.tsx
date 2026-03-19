import { Outlet } from 'react-router';
import { LayoutFooter } from './components/layout-footer';
import { Sidebar } from './components/sidebar';
import { Topbar } from './components/topbar';
import type { LayoutEngineProps } from './layout.types';
import { useTenant } from '@/core/tenant';

export function LayoutEngine({ navigationItems }: LayoutEngineProps) {
  const { config } = useTenant();
  const { appName, branding } = config;
  const { sidebarPosition, showFooter, footerText, showSearchbar } = config.layout;

  if (sidebarPosition === 'top') {
    return (
      <div className='flex h-screen flex-col'>
        <Topbar branding={branding} appName={appName} navigationItems={navigationItems} showSearchbar={showSearchbar} />
        <main className='flex-1 overflow-auto p-4'>
          <Outlet />
        </main>
        {showFooter && footerText && <LayoutFooter footerText={footerText} />}
      </div>
    );
  }

  return (
    <div className={`flex h-screen ${sidebarPosition === 'right' ? 'flex-row-reverse' : ''}`}>
      <Sidebar branding={branding} appName={appName} navigationItems={navigationItems} showSearchbar={showSearchbar} />
      <div className='flex flex-1 flex-col overflow-hidden'>
        <main className='flex-1 overflow-auto p-4'>
          <Outlet />
        </main>
        {showFooter && footerText && <LayoutFooter footerText={footerText} />}
      </div>
    </div>
  );
}
