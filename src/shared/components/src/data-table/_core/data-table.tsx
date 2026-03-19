import { Children, useId, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ErrorBoundary } from '../../../lib/error-boundary';
import { DataTableProvider } from '../../../providers/data-table.provider';
import {
  createDataTableStore,
  type DataTableConfig,
  type DataTableStoreApi,
} from '../../../store/data-table/data-table.store';
import { Loader } from '../../loader';
import { defaultGetRowId } from '../_features/data-table-columns';
import { DEFAULT_ROW_HEIGHT } from '../_features/data-table-pagination';
import { DataTableBody } from '../_parts/body/data-table-body';
import { DataTableFooter } from '../_parts/footer/data-table-footer';
import { DataTableHeader } from '../_parts/header/data-table-header';
import { DataTablePagination } from '../_parts/pagination/data-table-pagination';
import { DataTableToolbar } from '../_parts/toolbar/data-table-toolbar';
import type { DataTableBaseProps, DataTableColumnDef } from './data-table.types';
import { dataTableVariants } from './data-table.variants';

export function DataTable<TData>(props: DataTableBaseProps<TData>) {
  const {
    className,
    mode = 'client',
    size,
    striped = true,
    responsive,
    bordered,
    data,
    columns: columnsProp,
    children,
    getRowId = defaultGetRowId,
    ui: uiProp,
    pagination: paginationProp,
    sorting: sortingProp,
    selection: selectionProp,
    expansion: expansionProp,
    virtualization: virtualizationProp,
    filtering: filteringProp,
    visibility: visibilityProp,
    id,
    ref,
  } = props;

  const generatedId = useId();
  const tableId = id || generatedId;
  const scrollRef = useRef<HTMLDivElement>(null);

  const enableVirtualization = !!virtualizationProp;
  const estimateRowHeight =
    (typeof virtualizationProp === 'object' ? virtualizationProp.estimateRowHeight : undefined) ?? DEFAULT_ROW_HEIGHT;

  // MARK: Resolver colunas (usa React Children API)
  const allColumns = useMemo<DataTableColumnDef<TData>[]>(() => {
    if (columnsProp) return columnsProp;
    const cols: DataTableColumnDef<TData>[] = [];
    Children.forEach(children, (child) => {
      if (
        child &&
        typeof child === 'object' &&
        'props' in child &&
        (child as React.ReactElement<{ id?: string }>).props?.id
      ) {
        cols.push(child.props as DataTableColumnDef<TData>);
      }
    });
    return cols;
  }, [columnsProp, children]);

  // MARK: Montar objeto de config
  const config: DataTableConfig<TData> = {
    mode,
    sorting: sortingProp,
    filtering: filteringProp,
    pagination: paginationProp,
    selection: selectionProp,
    expansion: expansionProp,
    virtualization: virtualizationProp,
    visibility: visibilityProp,
    ui: uiProp,
    striped,
  };

  // MARK: Criar store (1x)
  const [store] = useState(() => createDataTableStore<TData>({ data, allColumns, getRowId, config }));

  // MARK: Sincronizar mudanças externas via _sync
  const dataRef = useRef(data);
  const columnsRef = useRef(allColumns);

  useLayoutEffect(() => {
    store.getState()._sync({
      config,
      ...(data !== dataRef.current || getRowId !== store.getState()._getRowId ? { data, getRowId } : {}),
      ...(allColumns !== columnsRef.current ? { allColumns } : {}),
    });
    dataRef.current = data;
    columnsRef.current = allColumns;
  });

  // MARK: Handle imperativo
  useImperativeHandle(ref, () => ({
    updateCell: (rowId, columnId, value) => store.getState().cellData.updateCell(rowId, columnId, value),
    updateRow: (rowId, partial) => store.getState().cellData.updateRow(rowId, partial),
    getData: () => store.getState().cellData.getAllRows(),
    scrollToRow: (rowId) => {
      if (!scrollRef.current || !enableVirtualization) return;
      const flatRows = store.getState().rows.flat;
      const rowIndex = flatRows.findIndex((r) => r.id === rowId);
      if (rowIndex >= 0) scrollRef.current.scrollTop = rowIndex * estimateRowHeight;
    },
  }));

  // MARK: Renderizar
  const styles = dataTableVariants({ size, striped, responsive, bordered });
  const storeState = store.getState();
  const hasFooter = storeState.columns.visible.some((col) => col.footer !== undefined);
  const showToolbar =
    storeState.expansion.hasExpandable || storeState.filtering.enabled || storeState.columns.enableVisibility;
  const loading = storeState.ui.loading;

  return (
    <ErrorBoundary>
      <DataTableProvider store={store as DataTableStoreApi}>
        <div id={tableId} data-slot='data-table' className={styles.root({ className })}>
          {showToolbar && <DataTableToolbar />}

          <div ref={scrollRef} className={styles.scrollArea({ className: loading ? 'overflow-hidden' : undefined })}>
            <table
              className={styles.table()}
              style={{
                tableLayout: Object.keys(storeState.columns.widths).length > 0 ? 'fixed' : undefined,
              }}
            >
              <DataTableHeader />
              <DataTableBody />
              {hasFooter && <DataTableFooter />}
            </table>

            {loading && <Loader overlay size='lg' message='Carregando dados' />}
          </div>

          {storeState.pagination.enabled && <DataTablePagination />}
        </div>
      </DataTableProvider>
    </ErrorBoundary>
  );
}
