import type { VariantProps } from 'tailwind-variants';
import type { treeVariants } from './tree.variants';

export type TreeNode<TData = unknown> = {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactElement;
  children?: TreeNode<TData>[];
  disabled?: boolean;
  data?: TData;
  loadChildren?: () => Promise<TreeNode<TData>[]>;
};

export type TreeSelectionMode = 'none' | 'single' | 'multiple';

export type TreeBaseProps<TData = unknown> = Omit<React.ComponentProps<'div'>, 'children' | 'onSelect'> &
  VariantProps<typeof treeVariants> & {
    nodes: TreeNode<TData>[];
    selectionMode?: TreeSelectionMode;
    expanded?: string[];
    defaultExpanded?: string[];
    onExpandedChange?: (expanded: string[]) => void;
    selected?: string[];
    defaultSelected?: string[];
    onSelectedChange?: (selected: string[]) => void;
  };
