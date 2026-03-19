import { IconChevronRight, IconCheckbox, IconMinus, IconSpinner } from '../../../icon';
import { treeUtils } from '../../_core/tree.utils';
import { treeNodeVariants } from '../../_core/tree.variants';
import type { TreeNodeBaseProps } from './tree-node.types';

export function TreeNode<TData = unknown>(props: TreeNodeBaseProps<TData>) {
  const {
    node,
    nodes,
    level,
    expanded,
    selected,
    selectionMode,
    focusedId,
    onToggleExpand,
    onSelect,
    onFocus,
    onKeyDown,
    onLoadChildren,
    loadingIds,
  } = props;

  const hasChildren = treeUtils.hasChildren(node);
  const isExpanded = expanded.includes(node.id);
  const isSelected = selected.includes(node.id);
  const isFocused = focusedId === node.id;
  const isLoading = loadingIds.includes(node.id);
  const showCheckboxes = selectionMode === 'multiple';
  const checkState = showCheckboxes ? treeUtils.getCheckState(node, selected) : null;

  const styles = treeNodeVariants({
    selected: isSelected && selectionMode !== 'none',
    disabled: !!node.disabled,
  });

  const handleClick = () => {
    if (node.disabled) return;
    if (selectionMode !== 'none') onSelect(node);
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.disabled) return;

    if (node.loadChildren && !node.children?.length && !isLoading) {
      onLoadChildren(node);
    } else {
      onToggleExpand(node.id);
    }
  };

  return (
    <>
      <div
        role='treeitem'
        data-slot='tree-node'
        data-node-id={node.id}
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-selected={selectionMode !== 'none' ? isSelected : undefined}
        aria-level={level + 1}
        aria-disabled={node.disabled || undefined}
        tabIndex={isFocused ? 0 : -1}
        className={styles.root()}
        style={{
          paddingLeft: `${level * 20 + 8}px`,
          ...(level > 0 &&
            !isSelected && {
              backgroundColor: `color-mix(in srgb, var(--muted) ${Math.min(level * 6, 24)}%, transparent)`,
            }),
        }}
        onClick={handleClick}
        onKeyDown={(e) => onKeyDown(e, node)}
        onFocus={() => onFocus(node.id)}
      >
        {showCheckboxes && (
          <span className={styles.checkbox()} data-slot='tree-checkbox' aria-hidden>
            {checkState === 'indeterminate' ? (
              <IconMinus size='sm' color='primary' />
            ) : (
              <IconCheckbox size='sm' color='primary' checked={checkState === 'checked'} />
            )}
          </span>
        )}

        {hasChildren ? (
          <button
            type='button'
            data-slot='tree-expand'
            className={styles.expandIcon({ expanded: isExpanded })}
            onClick={handleExpandClick}
            tabIndex={-1}
            aria-hidden
          >
            {isLoading ? (
              <IconSpinner size='sm' color='muted' className={styles.loadingIcon()} />
            ) : (
              <IconChevronRight size='sm' color='muted' />
            )}
          </button>
        ) : (
          <span className={styles.expandPlaceholder()} />
        )}

        {node.icon && <span className={styles.nodeIcon()}>{node.icon}</span>}

        <span className={styles.nodeLabel()}>{node.label}</span>
      </div>

      {hasChildren && node.children && (
        <div
          role='group'
          data-slot='tree-children'
          className={styles.children()}
          style={{ gridTemplateRows: isExpanded ? '1fr' : '0fr' }}
        >
          <div className={styles.childrenInner()}>
            {node.children.map((child) => (
              <TreeNode<TData>
                key={child.id}
                node={child}
                nodes={nodes}
                level={level + 1}
                expanded={expanded}
                selected={selected}
                selectionMode={selectionMode}
                focusedId={focusedId}
                onToggleExpand={onToggleExpand}
                onSelect={onSelect}
                onFocus={onFocus}
                onKeyDown={onKeyDown}
                onLoadChildren={onLoadChildren}
                loadingIds={loadingIds}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
