import { NavLink } from 'react-router';
import type { LayoutNavigationLinkProps } from '../layout.types';

export function NavigationLink({ item }: LayoutNavigationLinkProps) {
  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      className={({ isActive }) =>
        `rounded-md px-3 py-2 text-sm transition-colors ${isActive ? 'bg-background shadow-sm' : 'hover:bg-muted/40'}`
      }
    >
      {item.label}
    </NavLink>
  );
}
