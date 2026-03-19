import type { SidebarModule } from '../../_core/sidebar.types';

export type SidebarSearchResultItem = {
  label: string;
  href: string;
};

export type SidebarSearchProps = {
  modules: SidebarModule[];
  open: boolean;
  onClose: () => void;
  onSelect: (moduleId: string, item: SidebarSearchResultItem) => void;
};

export type SidebarSearchResult = {
  module: SidebarModule;
  item: SidebarSearchResultItem;
};
