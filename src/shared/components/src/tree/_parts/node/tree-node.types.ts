import type { TreeBaseProps, TreeNode } from '../../_core/tree.types';

export type TreeNodeBaseProps<TData = unknown> = {
  node: TreeNode<TData>;
  nodes: TreeNode<TData>[];
  level: number;
  expanded: string[];
  selected: string[];
  selectionMode: TreeBaseProps<TData>['selectionMode'];
  focusedId: string | null;
  onToggleExpand: (id: string) => void;
  onSelect: (node: TreeNode<TData>) => void;
  onFocus: (id: string) => void;
  onKeyDown: (e: React.KeyboardEvent, node: TreeNode<TData>) => void;
  onLoadChildren: (node: TreeNode<TData>) => void;
  loadingIds: string[];
};
