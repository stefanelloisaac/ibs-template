import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from '../../../../hooks/use-debounce';
import { IconFilter } from '../../../icon/_presets/filter/icon-filter';
import { inputVariants } from '../../../input/_core/input.variants';
import { Popover } from '../../../popover';
import { getFilterType } from '../../_features/data-table-filtering';
import type { DataTableHeaderFilterProps } from './data-table-header-filter.types';
import { dataTableHeaderFilterVariants } from './data-table-header-filter.variants';

const inputClass = inputVariants({ intent: 'default', fullWidth: true }).control();

export function DataTableHeaderFilter(props: DataTableHeaderFilterProps) {
  const { columnId, columnType, typeOptions, filterValue, onFilterChange } = props;

  const [open, setOpen] = useState(false);
  const [localValue, setLocalValue] = useState(filterValue);
  const debouncedFilterChange = useDebounce(onFilterChange, 300);

  const filterType = getFilterType(columnType);
  const hasActiveFilter = Object.keys(filterValue).length > 0;

  const styles = dataTableHeaderFilterVariants();

  // Sync externo → local
  useEffect(() => {
    setLocalValue(filterValue);
  }, [filterValue]);

  const selectedBoolValue = filterValue.selected?.length === 1 ? String(filterValue.selected[0]) : '';

  const boolOptions = [
    { value: '', label: 'Todos' },
    { value: 'true', label: typeOptions?.trueLabel ?? (columnType === 'status' ? 'Ativo' : 'Sim') },
    { value: 'false', label: typeOptions?.falseLabel ?? (columnType === 'status' ? 'Inativo' : 'Não') },
  ];

  const handleBoolOptionClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const val = e.currentTarget.dataset.value!;
      onFilterChange(val === '' ? null : { selected: [val === 'true'] });
    },
    [onFilterChange],
  );

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      portal
      placement='bottom-start'
      trigger={
        <button
          type='button'
          className={styles.trigger({ active: hasActiveFilter })}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Filtrar ${columnId}`}
        >
          <IconFilter size='xs' />
        </button>
      }
      contentClassName='min-w-48 p-2'
    >
      {filterType === 'text' && (
        <input
          type='text'
          placeholder='Buscar'
          className={inputClass}
          value={localValue.text ?? ''}
          autoFocus
          onChange={(e) => {
            const text = e.target.value;
            const next = text ? { ...localValue, text } : {};
            setLocalValue(next);
            debouncedFilterChange(text ? { ...filterValue, text } : null);
          }}
        />
      )}

      {filterType === 'range' && (
        <div className={styles.filterRange()}>
          <input
            type='number'
            inputMode='numeric'
            placeholder='Min'
            className={inputClass}
            value={localValue.min ?? ''}
            autoFocus
            onChange={(e) => {
              const min = e.target.value ? Number(e.target.value) : null;
              const hasValue = min != null || localValue.max != null;
              setLocalValue(hasValue ? { ...localValue, min } : {});
              debouncedFilterChange(hasValue ? { ...filterValue, min } : null);
            }}
          />
          <input
            type='number'
            inputMode='numeric'
            placeholder='Max'
            className={inputClass}
            value={localValue.max ?? ''}
            onChange={(e) => {
              const max = e.target.value ? Number(e.target.value) : null;
              const hasValue = localValue.min != null || max != null;
              setLocalValue(hasValue ? { ...localValue, max } : {});
              debouncedFilterChange(hasValue ? { ...filterValue, max } : null);
            }}
          />
        </div>
      )}

      {filterType === 'dateRange' && (
        <div className={styles.filterRange()}>
          <input
            type='date'
            className={inputClass}
            value={localValue.from ?? ''}
            autoFocus
            onChange={(e) => {
              const from = e.target.value || null;
              const hasValue = from != null || localValue.to != null;
              setLocalValue(hasValue ? { ...localValue, from } : {});
              debouncedFilterChange(hasValue ? { ...filterValue, from } : null);
            }}
          />
          <input
            type='date'
            className={inputClass}
            value={localValue.to ?? ''}
            onChange={(e) => {
              const to = e.target.value || null;
              const hasValue = localValue.from != null || to != null;
              setLocalValue(hasValue ? { ...localValue, to } : {});
              debouncedFilterChange(hasValue ? { ...filterValue, to } : null);
            }}
          />
        </div>
      )}

      {filterType === 'select' && (
        <div>
          {boolOptions.map((opt) => (
            <div
              key={opt.value}
              className={styles.filterOption({ selected: selectedBoolValue === opt.value })}
              data-value={opt.value}
              onClick={handleBoolOptionClick}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </Popover>
  );
}
