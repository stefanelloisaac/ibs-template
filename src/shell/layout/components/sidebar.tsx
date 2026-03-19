import type { SidebarProps } from '../layout.types';
import { Branding } from './branding';
import { NavigationLink } from './navigation-link';
import { SearchPlaceholder } from './search-placeholder';
import { ThemeToggle } from './theme-toggle';

export function Sidebar({ branding, appName, navigationItems, showSearchbar }: SidebarProps) {
  return (
    <aside className='flex w-56 flex-col border-r bg-muted/40'>
      <div className='flex h-14 items-center gap-2 border-b px-4'>
        <Branding branding={branding} appName={appName} />
      </div>

      {showSearchbar && (
        <div className='px-3 pt-3'>
          <SearchPlaceholder />
        </div>
      )}

      <nav className='flex flex-1 flex-col gap-1 p-3'>
        {navigationItems.map((item) => (
          <NavigationLink key={item.to} item={item} />
        ))}
      </nav>

      <div className='border-t p-3'>
        <ThemeToggle />
      </div>
    </aside>
  );
}
