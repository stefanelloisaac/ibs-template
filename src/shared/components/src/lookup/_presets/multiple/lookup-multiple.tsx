import { useMemo, useRef, useState } from 'react';
import { useControllable } from '../../../../hooks/use-controllable';
import { ButtonOutline, ButtonPrimary } from '../../../button';
import { DataTableLookup, type DataTableRowSelection } from '../../../data-table';
import { defaultGetRowId } from '../../../data-table/_features/data-table-columns';
import {
  Dialog,
  DialogAction,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../dialog';
import { IconClose, IconSearch } from '../../../icon';
import { Lookup } from '../../_core/lookup';
import type { LookupMultipleProps } from './lookup-multiple.types';
import { lookupMultipleUtils } from './lookup-multiple.utils';
import { lookupMultipleVariants } from './lookup-multiple.variants';

export function LookupMultiple<TData>(props: LookupMultipleProps<TData>) {
  const {
    data,
    columns,
    getRowId,
    value,
    defaultValue,
    onValueChange,
    displayValue,
    serializedValue,
    label,
    errorMessage,
    required,
    disabled,
    placeholder = 'Selecione',
    fullWidth,
    name,
    onBlur,
    dialogTitle = 'Selecionar',
    dialogDescription,
    pagination,
    sorting,
    filtering,
    className,
  } = props;

  const hiddenRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useControllable<TData[]>(value, defaultValue ?? [], onValueChange);
  const [pendingItems, setPendingItems] = useState<TData[]>([]);

  const resolveRowId = getRowId ?? defaultGetRowId;
  const resolveSerializedValue = serializedValue ?? displayValue;

  const selectionState: DataTableRowSelection = useMemo(() => {
    const items = isOpen ? pendingItems : selectedItems;
    const state: DataTableRowSelection = {};
    for (const item of items) {
      const rowId = resolveRowId(item, -1);
      state[rowId] = true;
    }
    return state;
  }, [isOpen, pendingItems, selectedItems, resolveRowId]);

  const handleTriggerClick = () => {
    if (disabled) return;
    setPendingItems([...selectedItems]);
    setIsOpen(true);
  };

  const handleRowClick = (row: TData) => {
    setPendingItems((prev) => lookupMultipleUtils.toggleItem(row, prev, resolveRowId));
  };

  const handleConfirm = () => {
    setSelectedItems(pendingItems);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleCancel = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleRemove = (item: TData) => {
    const newSelected = lookupMultipleUtils.removeItem(item, selectedItems, resolveRowId);
    setSelectedItems(newSelected);
    triggerRef.current?.focus();
  };

  const handleClear = () => {
    setSelectedItems([]);
    triggerRef.current?.focus();
  };

  const handleContainerBlur = (e: React.FocusEvent) => {
    const container = e.currentTarget;
    if (container.contains(e.relatedTarget as Node)) return;
    if (hiddenRef.current && onBlur) {
      onBlur({
        ...e,
        target: hiddenRef.current,
        currentTarget: hiddenRef.current,
      } as React.FocusEvent<HTMLInputElement>);
    }
  };

  const formValue = selectedItems.map((item) => resolveSerializedValue(item)).join(',');

  const styles = lookupMultipleVariants();

  const chipsSlot =
    selectedItems.length > 0
      ? selectedItems.map((item) => {
          const itemLabel = displayValue(item);
          return (
            <span key={resolveRowId(item, -1)} data-slot='lookup-chip' className={styles.tag()}>
              <span>{itemLabel}</span>
              {!disabled && (
                <span
                  role='button'
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(item);
                  }}
                  className={styles.tagButton()}
                  aria-label={`Remover ${itemLabel}`}
                >
                  <IconClose size='xs' color='muted' />
                </span>
              )}
            </span>
          );
        })
      : null;

  const actionsSlot = (
    <div className={styles.actionsWrapper()}>
      {selectedItems.length > 0 && !disabled && (
        <button type='button' onClick={handleClear} className={styles.clearButton()} aria-label='Limpar seleção'>
          <IconClose size='sm' color='muted' />
        </button>
      )}
      <button
        type='button'
        onClick={handleTriggerClick}
        className={styles.searchButton()}
        aria-label='Abrir pesquisa'
        tabIndex={-1}
        disabled={disabled}
      >
        <IconSearch size='sm' color='muted' />
      </button>
    </div>
  );

  return (
    <div onBlur={handleContainerBlur}>
      <input
        ref={hiddenRef}
        className='sr-only'
        tabIndex={-1}
        name={name}
        value={formValue}
        required={required}
        onChange={() => {}}
      />

      <Lookup
        ref={triggerRef}
        label={label}
        errorMessage={errorMessage}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        fullWidth={fullWidth}
        compound
        beforeInput={chipsSlot}
        onTriggerClick={handleTriggerClick}
        afterInput={actionsSlot}
        className={className}
      />

      <Dialog open={isOpen} onClose={handleCancel} className={styles.dialog()}>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          {dialogDescription && <DialogDescription>{dialogDescription}</DialogDescription>}
          <DialogAction onClose={handleCancel} />
        </DialogHeader>
        <DialogContent>
          <DataTableLookup<TData>
            data={data}
            columns={columns}
            getRowId={resolveRowId}
            onRowClick={handleRowClick}
            selectionState={selectionState}
            pagination={pagination}
            sorting={sorting}
            filtering={filtering}
          />
        </DialogContent>
        <DialogFooter>
          <ButtonOutline onClick={handleCancel}>Cancelar</ButtonOutline>
          <ButtonPrimary onClick={handleConfirm}>Confirmar</ButtonPrimary>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

LookupMultiple.validatorKey = 'lookup-multiple';
