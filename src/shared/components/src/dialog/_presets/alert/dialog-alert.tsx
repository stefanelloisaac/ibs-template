import { useId } from 'react';
import { ButtonOutline } from '../../../button';
import { Button } from '../../../button/_core/button';
import { Dialog } from '../../_core/dialog';
import { DialogDescription } from '../../_parts/description/dialog-description';
import { DialogFooter } from '../../_parts/footer/dialog-footer';
import { DialogHeader } from '../../_parts/header/dialog-header';
import { DialogTitle } from '../../_parts/title/dialog-title';
import type { DialogAlertProps } from './dialog-alert.types';
import { dialogAlertVariants } from './dialog-alert.variants';

export function DialogAlert(props: DialogAlertProps) {
  const {
    className,
    size,
    open,
    onConfirm,
    onCancel,
    title = 'Confirmação',
    description,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    intent = 'info',
    id,
    children,
  } = props;

  const generatedId = useId();
  const alertId = id || generatedId;
  const styles = dialogAlertVariants({ intent });

  return (
    <Dialog
      id={alertId}
      size={size}
      open={open}
      onClose={onCancel}
      className={styles.dialog({ className })}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {description && <DialogDescription>{description}</DialogDescription>}
      </DialogHeader>

      {children}

      <DialogFooter justify='end' className={styles.footer()}>
        <ButtonOutline onClick={onCancel}>{cancelLabel}</ButtonOutline>
        <Button onClick={onConfirm} className={styles.confirmButton()}>
          {confirmLabel}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
