import type { DataTableColumnType, DataTableFilterValue, DataTableTypeOptions } from '../../_core/data-table.types';

export type DataTableHeaderFilterProps = {
  columnId: string;
  columnType?: DataTableColumnType;
  typeOptions?: DataTableTypeOptions;
  filterValue: DataTableFilterValue;
  onFilterChange: (value: DataTableFilterValue | null) => void;
};
