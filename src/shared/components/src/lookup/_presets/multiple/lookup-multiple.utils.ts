export const lookupMultipleUtils = {
  toggleItem<TData>(item: TData, selected: TData[], getRowId: (row: TData, index: number) => string): TData[] {
    const id = getRowId(item, -1);
    const exists = selected.some((s) => getRowId(s, -1) === id);
    if (exists) {
      return selected.filter((s) => getRowId(s, -1) !== id);
    }
    return [...selected, item];
  },

  removeItem<TData>(item: TData, selected: TData[], getRowId: (row: TData, index: number) => string): TData[] {
    const id = getRowId(item, -1);
    return selected.filter((s) => getRowId(s, -1) !== id);
  },
};
