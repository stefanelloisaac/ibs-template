import { ButtonOutline, ButtonPrimary } from '../../../button';
import { Dialog } from '../../_core/dialog';
import { DialogContent } from '../../_parts/content/dialog-content';
import { DialogDescription } from '../../_parts/description/dialog-description';
import { DialogFooter } from '../../_parts/footer/dialog-footer';
import { DialogHeader } from '../../_parts/header/dialog-header';
import { DialogTitle } from '../../_parts/title/dialog-title';
import type { DialogFormProps } from './dialog-form.types';

export function DialogForm(props: DialogFormProps) {
  const {
    className,
    open,
    onClose,
    title,
    description,
    onSubmit,
    submitLabel = 'Salvar',
    cancelLabel = 'Cancelar',
    isSubmitting = false,
    submitDisabled = false,
    children,
  } = props;

  return (
    <Dialog size='lg' open={open} onClose={onClose} className={className}>
      <form onSubmit={onSubmit}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <DialogContent className='overflow-visible'>{children}</DialogContent>

        <DialogFooter justify='end'>
          <ButtonOutline type='button' onClick={onClose} disabled={isSubmitting}>
            {cancelLabel}
          </ButtonOutline>
          <ButtonPrimary type='submit' disabled={submitDisabled || isSubmitting} loading={isSubmitting}>
            {submitLabel}
          </ButtonPrimary>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
