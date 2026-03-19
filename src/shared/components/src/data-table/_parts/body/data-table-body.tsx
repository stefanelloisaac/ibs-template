import { useRef, useState, useEffect } from 'react';
import {
  useDataTableColumns,
  useDataTableExpansion,
  useDataTableRows,
  useDataTableSelection,
  useDataTableUI,
  useDataTableVirtualization,
} from '../../../../store/data-table/use-data-table';
import { DataTableRow } from '../row/data-table-row';
import { dataTableBodyVariants } from './data-table-body.variants';

export function DataTableBody() {
  const rows = useDataTableRows();
  const columns = useDataTableColumns();
  const virtualization = useDataTableVirtualization();
  const ui = useDataTableUI();
  const selection = useDataTableSelection();
  const expansion = useDataTableExpansion();

  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const tbodyRef = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
    if (!virtualization.enabled || !tbodyRef.current) return;
    const scrollParent = tbodyRef.current.closest('[data-slot="data-table"] > div');
    if (!scrollParent) return;

    const handleScroll = () => setScrollTop((scrollParent as HTMLElement).scrollTop);
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) setContainerHeight(entry.contentRect.height);
    });

    scrollParent.addEventListener('scroll', handleScroll);
    observer.observe(scrollParent);

    return () => {
      scrollParent.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [virtualization.enabled]);

  const styles = dataTableBodyVariants();
  const colSpan = columns.visible.length + (selection.enabled ? 1 : 0) + (expansion.hasExpandable ? 1 : 0);

  if (rows.flat.length === 0 && !ui.loading) {
    return (
      <tbody data-slot='data-table-body' className={styles.root()}>
        <tr>
          <td colSpan={colSpan} className={styles.empty()}>
            {ui.emptyMessage}
          </td>
        </tr>
      </tbody>
    );
  }

  if (virtualization.enabled && rows.flat.length > 0) {
    const totalHeight = rows.flat.length * virtualization.estimateRowHeight;
    const overscan = 10;
    const startIndex = Math.max(0, Math.floor(scrollTop / virtualization.estimateRowHeight) - overscan);
    const visibleCount = Math.ceil(containerHeight / virtualization.estimateRowHeight) + overscan * 2;
    const endIndex = Math.min(rows.flat.length, startIndex + visibleCount);
    const visibleRows = rows.flat.slice(startIndex, endIndex);
    const paddingTop = startIndex * virtualization.estimateRowHeight;
    const paddingBottom = Math.max(0, totalHeight - endIndex * virtualization.estimateRowHeight);

    return (
      <tbody ref={tbodyRef} data-slot='data-table-body' className={styles.root()}>
        {paddingTop > 0 && (
          <tr aria-hidden='true'>
            <td style={{ height: paddingTop, padding: 0, border: 'none' }} />
          </tr>
        )}
        {visibleRows.map((row) => (
          <DataTableRow key={row.id} row={row} />
        ))}
        {paddingBottom > 0 && (
          <tr aria-hidden='true'>
            <td style={{ height: paddingBottom, padding: 0, border: 'none' }} />
          </tr>
        )}
      </tbody>
    );
  }

  return (
    <tbody ref={tbodyRef} data-slot='data-table-body' className={styles.root()}>
      {rows.flat.map((row) => (
        <DataTableRow key={row.id} row={row} />
      ))}
    </tbody>
  );
}
