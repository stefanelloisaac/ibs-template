import { createContext, useContext } from 'react';
import { useStore } from 'zustand';
import type { DataTableStoreApi, DataTableStoreState } from '../store/data-table/data-table.store';

/**
 * @provider DataTableProvider
 * @description Disponibiliza o store Zustand da tabela via React Context.
 * O store e criado externamente pelo componente DataTable e passado como prop.
 * Os sub-componentes internos (header, body, toolbar, etc.) consomem o store
 * atraves dos hooks `useDataTable` e `useDataTableStoreApi`.
 */

interface DataTableProviderProps {
  store: DataTableStoreApi;
  children: React.ReactNode;
}

const DataTableContext = createContext<DataTableStoreApi | null>(null);

export function DataTableProvider({ store, children }: DataTableProviderProps) {
  return <DataTableContext.Provider value={store}>{children}</DataTableContext.Provider>;
}

export function useDataTableStoreApi(): DataTableStoreApi {
  const store = useContext(DataTableContext);
  if (!store) throw new Error('DataTable: must be used within <DataTable>');
  return store;
}

export function useDataTable<T>(selector: (state: DataTableStoreState) => T): T {
  const store = useDataTableStoreApi();
  return useStore(store, selector);
}
