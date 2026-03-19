import { useId } from 'react';
import type { DialogFooterProps } from './dialog-footer.types';
import { dialogFooterVariants } from './dialog-footer.variants';

export function DialogFooter(props: DialogFooterProps) {
  const { className, justify, id, ref, ...rest } = props;

  const generatedId = useId();
  const footerId = id || generatedId;
  const styles = dialogFooterVariants({ justify });

  return <div ref={ref} id={footerId} data-slot='dialog-footer' className={styles.root({ className })} {...rest} />;
}
