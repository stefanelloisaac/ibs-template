export type DataTableHeaderMenuProps = {
  columnId: string;
  sortable?: boolean;
  sortState?: { desc: boolean } | undefined;
  onSortAsc: () => void;
  onSortDesc: () => void;
  pinState?: 'left' | 'right' | undefined;
  onPinLeft: () => void;
  onPinRight: () => void;
  onUnpin: () => void;
  onResetColumn: () => void;
};
