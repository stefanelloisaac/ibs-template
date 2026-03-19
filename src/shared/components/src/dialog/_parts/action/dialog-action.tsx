import { useId } from 'react';
import { ButtonIcon } from '../../../button';
import { IconClose } from '../../../icon';
import type { DialogActionProps } from './dialog-action.types';
import { dialogActionVariants } from './dialog-action.variants';

export function DialogAction(props: DialogActionProps) {
  const { className, id, ref, children, onClose, ...rest } = props;

  const generatedId = useId();
  const actionId = id || generatedId;
  const styles = dialogActionVariants();

  return (
    <div ref={ref} id={actionId} data-slot='dialog-action' className={styles.root({ className })} {...rest}>
      {children}
      <ButtonIcon variant='ghost' size='sm' icon={<IconClose />} onClick={onClose} aria-label='Fechar' />
    </div>
  );
}
