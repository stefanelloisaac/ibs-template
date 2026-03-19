import { useId } from 'react';
import { useDialogElement } from '../../../hooks/use-dialog-element';
import { ErrorBoundary } from '../../../lib/error-boundary';
import { mergeRefs } from '../../../lib/merge-refs';
import type { DialogBaseProps } from './dialog.types';
import { dialogVariants } from './dialog.variants';

export function Dialog(props: DialogBaseProps) {
  const { className, size, children, open, onClose, onClick, id, ref, ...rest } = props;

  const { dialogRef, isClosing } = useDialogElement({ open, onClose });

  const generatedId = useId();
  const dialogId = id || generatedId;

  const styles = dialogVariants({ size });

  const handleClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) onClose();
    onClick?.(e);
  };

  return (
    <ErrorBoundary>
      <dialog
        ref={mergeRefs(dialogRef, ref)}
        id={dialogId}
        data-slot='dialog'
        data-closing={isClosing ? '' : undefined}
        className={styles.root({ className })}
        onClick={handleClick}
        {...rest}
      >
        {children}
      </dialog>
    </ErrorBoundary>
  );
}
