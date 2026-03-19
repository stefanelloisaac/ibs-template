import type { StoreSet } from '../data-table.types';

/**
 * @store createCellDataActions
 * @description Actions para mutacao in-memory de celulas e linhas da tabela.
 * Incrementa `_version` a cada mutacao para sinalizar subscribers (ex: `useCellValue`).
 * Usado para edicao inline de dados sem precisar repassar o array inteiro.
 */

export function createCellDataActions<TData>(set: StoreSet<TData>) {
  const updateCell = (rowId: string, columnId: string, value: unknown) => {
    set((state) => {
      const row = state.cellData._data.get(rowId);
      if (!row) return state;
      const newData = new Map(state.cellData._data);
      newData.set(rowId, { ...row, [columnId]: value } as TData);
      return { cellData: { ...state.cellData, _data: newData, _version: state.cellData._version + 1 } };
    });
  };

  const updateRow = (rowId: string, partial: Partial<TData>) => {
    set((state) => {
      const row = state.cellData._data.get(rowId);
      if (!row) return state;
      const newData = new Map(state.cellData._data);
      newData.set(rowId, { ...row, ...partial } as TData);
      return { cellData: { ...state.cellData, _data: newData, _version: state.cellData._version + 1 } };
    });
  };

  return { updateCell, updateRow };
}
