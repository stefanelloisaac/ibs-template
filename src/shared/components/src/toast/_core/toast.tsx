import { IconClose } from '../../icon';
import { getIntentIcon } from './toast.registry';
import type { ToastBaseProps } from './toast.types';
import { toastVariants } from './toast.variants';

export function Toast(props: ToastBaseProps) {
  const { className, item, onDismiss, ref, ...rest } = props;

  const styles = toastVariants({ intent: item.intent });
  const dismissible = item.dismissible !== false;

  return (
    <div
      ref={ref}
      role={item.intent === 'error' ? 'alert' : 'status'}
      aria-live={item.intent === 'error' ? 'assertive' : 'polite'}
      data-slot='toast'
      data-closing={item._closing ? '' : undefined}
      className={styles.root({ className })}
      {...rest}
    >
      <span className={styles.icon()}>{getIntentIcon(item.intent)}</span>
      <div className={styles.content()}>
        <p className={styles.title()}>{item.title}</p>
        {item.description && <p className={styles.description()}>{item.description}</p>}
      </div>
      {dismissible && (
        <button
          type='button'
          className={styles.closeButton()}
          onClick={() => onDismiss(item.id)}
          aria-label='Fechar notificação'
        >
          <IconClose className='size-4' />
        </button>
      )}
    </div>
  );
}
