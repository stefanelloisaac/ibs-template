import type { TopbarProps } from '../layout.types';
import { Branding } from './branding';
import { NavigationLink } from './navigation-link';
import { SearchPlaceholder } from './search-placeholder';
import { ThemeToggle } from './theme-toggle';

export function Topbar({ branding, appName, navigationItems, showSearchbar }: TopbarProps) {
  return (
    <header className='flex h-14 items-center justify-between border-b bg-muted/40 px-4'>
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2'>
          <Branding branding={branding} appName={appName} />
        </div>

        <nav className='flex items-center gap-1'>
          {navigationItems.map((item) => (
            <NavigationLink key={item.to} item={item} />
          ))}
        </nav>
      </div>

      <div className='flex items-center gap-2'>
        {showSearchbar && <SearchPlaceholder />}
        <ThemeToggle />
      </div>
    </header>
  );
}
