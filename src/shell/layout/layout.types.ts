export type LayoutNavigationItem = {
  to: string;
  label: string;
};

export type LayoutBranding = {
  logoIconUrl: string;
};

export type LayoutBrandingProps = {
  branding: LayoutBranding;
  appName: string;
};

export type LayoutNavigationLinkProps = {
  item: LayoutNavigationItem;
};

export type SidebarProps = {
  branding: LayoutBranding;
  appName: string;
  navigationItems: LayoutNavigationItem[];
  showSearchbar: boolean;
};

export type TopbarProps = {
  branding: LayoutBranding;
  appName: string;
  navigationItems: LayoutNavigationItem[];
  showSearchbar: boolean;
};

export type LayoutEngineProps = {
  navigationItems: LayoutNavigationItem[];
};
