import { useId } from 'react';
import { useDialogElement } from '../../../hooks/use-dialog-element';
import { ErrorBoundary } from '../../../lib/error-boundary';
import { mergeRefs } from '../../../lib/merge-refs';
import type { DrawerBaseProps } from './drawer.types';
import { drawerVariants } from './drawer.variants';

export function Drawer(props: DrawerBaseProps) {
  const { className, placement, size, children, open, onClose, onClick, id, ref, ...rest } = props;

  const { dialogRef, isClosing } = useDialogElement({ open, onClose });

  const generatedId = useId();
  const drawerId = id || generatedId;

  const styles = drawerVariants({ placement, size });

  const handleClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) onClose();
    onClick?.(e);
  };

  return (
    <ErrorBoundary>
      <dialog
        ref={mergeRefs(dialogRef, ref)}
        id={drawerId}
        data-slot='drawer'
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
