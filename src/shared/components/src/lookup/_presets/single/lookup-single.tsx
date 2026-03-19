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
import type { LookupSingleProps } from './lookup-single.types';
import { lookupSingleVariants } from './lookup-single.variants';

export function LookupSingle<TData>(props: LookupSingleProps<TData>) {
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
  const [selectedValue, setSelectedValue] = useControllable<TData | null>(value, defaultValue ?? null, onValueChange);
  const [pendingValue, setPendingValue] = useState<TData | null>(null);

  const resolveRowId = getRowId ?? defaultGetRowId;
  const resolveSerializedValue = serializedValue ?? displayValue;

  const selectionState: DataTableRowSelection = useMemo(() => {
    const target = isOpen ? pendingValue : selectedValue;
    if (!target) return {};
    const rowId = resolveRowId(target, -1);
    return { [rowId]: true };
  }, [isOpen, pendingValue, selectedValue, resolveRowId]);

  const handleTriggerClick = () => {
    if (disabled) return;
    setPendingValue(selectedValue);
    setIsOpen(true);
  };

  const handleRowClick = (row: TData) => {
    setPendingValue(row);
  };

  const handleConfirm = () => {
    setSelectedValue(pendingValue);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleCancel = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleClear = () => {
    setSelectedValue(null);
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

  const formValue = selectedValue ? resolveSerializedValue(selectedValue) : '';

  const styles = lookupSingleVariants();

  const chipsSlot = selectedValue ? (
    <span data-slot='lookup-chip' className={styles.tag()}>
      <span>{displayValue(selectedValue)}</span>
      {!disabled && (
        <span
          role='button'
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            handleClear();
          }}
          className={styles.tagButton()}
          aria-label={`Remover ${displayValue(selectedValue)}`}
        >
          <IconClose size='xs' color='muted' />
        </span>
      )}
    </span>
  ) : null;

  const actionsSlot = (
    <div className={styles.actionsWrapper()}>
      {selectedValue && !disabled && (
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

LookupSingle.validatorKey = 'lookup-single';
