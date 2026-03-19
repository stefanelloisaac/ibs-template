import type { TreeNode } from './tree.types';

export const treeUtils = {
  flattenVisible<T>(nodes: TreeNode<T>[], expanded: string[]): TreeNode<T>[] {
    const result: TreeNode<T>[] = [];
    const walk = (items: TreeNode<T>[]) => {
      for (const node of items) {
        result.push(node);
        if (node.children && expanded.includes(node.id)) {
          walk(node.children);
        }
      }
    };
    walk(nodes);
    return result;
  },

  findNode<T>(nodes: TreeNode<T>[], id: string): TreeNode<T> | undefined {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = treeUtils.findNode(node.children, id);
        if (found) return found;
      }
    }
    return undefined;
  },

  findParentId<T>(nodes: TreeNode<T>[], targetId: string, parentId: string | null = null): string | null {
    for (const node of nodes) {
      if (node.id === targetId) return parentId;
      if (node.children) {
        const found = treeUtils.findParentId(node.children, targetId, node.id);
        if (found !== null) return found;
      }
    }
    return null;
  },

  hasChildren<T>(node: TreeNode<T>): boolean {
    return !!(node.children && node.children.length > 0) || !!node.loadChildren;
  },

  getAllDescendantIds<T>(node: TreeNode<T>): string[] {
    const ids: string[] = [];
    const walk = (n: TreeNode<T>) => {
      if (n.children) {
        for (const child of n.children) {
          ids.push(child.id);
          walk(child);
        }
      }
    };
    walk(node);
    return ids;
  },

  getCheckState<T>(node: TreeNode<T>, selected: string[]): 'checked' | 'unchecked' | 'indeterminate' {
    if (!node.children || node.children.length === 0) {
      return selected.includes(node.id) ? 'checked' : 'unchecked';
    }
    const descendantIds = treeUtils.getAllDescendantIds(node);
    const selectedCount = descendantIds.filter((id) => selected.includes(id)).length;
    if (selectedCount === 0 && !selected.includes(node.id)) return 'unchecked';
    if (selectedCount === descendantIds.length) return 'checked';
    return 'indeterminate';
  },
};
