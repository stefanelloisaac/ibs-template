import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useArrowNavigation } from '../../../hooks/use-arrow-navigation';
import { useControllable } from '../../../hooks/use-controllable';
import { ErrorBoundary } from '../../../lib/error-boundary';
import { mergeRefs } from '../../../lib/merge-refs';
import { TreeNode as TreeNodeComponent } from '../_parts/node/tree-node';
import type { TreeBaseProps, TreeNode } from './tree.types';
import { treeUtils } from './tree.utils';
import { treeVariants } from './tree.variants';

export function Tree<TData = unknown>(props: TreeBaseProps<TData>) {
  const {
    className,
    selectionMode = 'none',
    nodes,
    expanded: controlledExpanded,
    defaultExpanded,
    selected: controlledSelected,
    defaultSelected,
    onExpandedChange,
    onSelectedChange,
    id,
    ref,
    ...rest
  } = props;

  const generatedId = useId();
  const baseId = id || generatedId;
  const styles = treeVariants();

  const [expanded, setExpanded] = useControllable<string[]>(
    controlledExpanded,
    defaultExpanded ?? [],
    onExpandedChange,
  );
  const [selected, setSelected] = useControllable<string[]>(
    controlledSelected,
    defaultSelected ?? [],
    onSelectedChange,
  );

  const [focusedId, setFocusedId] = useState<string | null>(null);

  const [loadingIds, setLoadingIds] = useState<string[]>([]);
  const [asyncChildren, setAsyncChildren] = useState<Record<string, TreeNode<TData>[]>>({});

  const mergedNodes = useMemo(() => {
    if (Object.keys(asyncChildren).length === 0) return nodes;

    const merge = (items: TreeNode<TData>[]): TreeNode<TData>[] =>
      items.map((node) => {
        const loaded = asyncChildren[node.id];
        const children = loaded ?? node.children;
        return {
          ...node,
          children: children ? merge(children) : undefined,
        };
      });

    return merge(nodes);
  }, [nodes, asyncChildren]);

  const visibleNodes = useMemo(() => treeUtils.flattenVisible(mergedNodes, expanded), [mergedNodes, expanded]);
  const effectiveFocusedId = focusedId ?? visibleNodes[0]?.id ?? null;

  const { setHighlightedIndex, onKeyDown: handleArrowNav } = useArrowNavigation({
    count: visibleNodes.length,
    loop: false,
    homeEnd: true,
    onHighlight: (index) => setFocusedId(visibleNodes[index].id),
  });

  const handleToggleExpand = useCallback(
    (id: string) => {
      setExpanded((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
    },
    [setExpanded],
  );

  const handleSelect = useCallback(
    (node: TreeNode<TData>) => {
      if (selectionMode === 'none') return;

      let next: string[];
      if (selectionMode === 'single') {
        next = selected.includes(node.id) ? [] : [node.id];
      } else {
        const descendantIds = treeUtils.getAllDescendantIds(node);
        const allIds = [node.id, ...descendantIds];
        const checkState = treeUtils.getCheckState(node, selected);

        if (checkState === 'checked') {
          next = selected.filter((id) => !allIds.includes(id));
        } else {
          next = Array.from(new Set([...selected, ...allIds]));
        }
      }

      setSelected(next);
    },
    [selectionMode, selected, setSelected],
  );

  const handleLoadChildren = useCallback(
    async (node: TreeNode<TData>) => {
      if (!node.loadChildren || loadingIds.includes(node.id)) return;

      setLoadingIds((prev) => [...prev, node.id]);
      try {
        const children = await node.loadChildren();
        setAsyncChildren((prev) => ({ ...prev, [node.id]: children }));
        setExpanded((prev) => [...prev, node.id]);
      } finally {
        setLoadingIds((prev) => prev.filter((id) => id !== node.id));
      }
    },
    [loadingIds, setExpanded],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, node: TreeNode<TData>) => {
      const hasNodeChildren = treeUtils.hasChildren(node);
      const isExpanded = expanded.includes(node.id);

      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowUp':
        case 'Home':
        case 'End':
          handleArrowNav(e);
          return;
        case 'ArrowRight': {
          e.preventDefault();
          if (hasNodeChildren && !isExpanded) {
            if (node.loadChildren && !node.children?.length) {
              handleLoadChildren(node);
            } else {
              handleToggleExpand(node.id);
            }
          } else if (hasNodeChildren && isExpanded && node.children?.length) {
            setFocusedId(node.children[0].id);
          }
          break;
        }
        case 'ArrowLeft': {
          e.preventDefault();
          if (hasNodeChildren && isExpanded) {
            handleToggleExpand(node.id);
          } else {
            const parentId = treeUtils.findParentId(mergedNodes, node.id);
            if (parentId) setFocusedId(parentId);
          }
          break;
        }
        case 'Enter':
        case ' ': {
          e.preventDefault();
          handleSelect(node);
          break;
        }
      }
    },
    [handleArrowNav, expanded, mergedNodes, handleToggleExpand, handleSelect, handleLoadChildren],
  );

  const handleFocus = useCallback(
    (id: string) => {
      setFocusedId(id);
      const index = visibleNodes.findIndex((n) => n.id === id);
      if (index !== -1) setHighlightedIndex(index);
    },
    [visibleNodes, setHighlightedIndex],
  );

  const treeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!focusedId || !treeRef.current) return;
    const el = treeRef.current.querySelector<HTMLElement>(`[data-node-id="${focusedId}"]`);
    if (el && el !== document.activeElement) el.focus();
  }, [focusedId]);

  return (
    <ErrorBoundary>
      <div
        ref={mergeRefs(treeRef, ref)}
        id={baseId}
        role='tree'
        data-slot='tree'
        aria-multiselectable={selectionMode === 'multiple' || undefined}
        className={styles.root({ className })}
        {...rest}
      >
        {mergedNodes.map((node) => (
          <TreeNodeComponent<TData>
            key={node.id}
            node={node}
            nodes={mergedNodes}
            level={0}
            expanded={expanded}
            selected={selected}
            selectionMode={selectionMode}
            focusedId={effectiveFocusedId}
            onToggleExpand={handleToggleExpand}
            onSelect={handleSelect}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            onLoadChildren={handleLoadChildren}
            loadingIds={loadingIds}
          />
        ))}
      </div>
    </ErrorBoundary>
  );
}
