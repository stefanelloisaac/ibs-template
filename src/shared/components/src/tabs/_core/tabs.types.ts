export type TabsTab = {
  value: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
};

export type TabsVariant = 'underline' | 'enclosed';

export type TabsBaseProps = Omit<React.ComponentProps<'div'>, 'children'> & {
  tabs: TabsTab[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: TabsVariant;
  fullWidth?: boolean;
};
