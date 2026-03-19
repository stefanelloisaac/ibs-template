import { useId } from 'react';
import type { StateBaseProps } from './state.types';
import { stateVariants } from './state.variants';

export function State(props: StateBaseProps) {
  const { className, size, title, description, icon, action, id, ref, ...rest } = props;

  const generatedId = useId();
  const stateId = id || generatedId;
  const styles = stateVariants({ size });

  return (
    <div ref={ref} id={stateId} data-slot='state' className={styles.root({ className })} {...rest}>
      {icon && <div className={styles.iconWrapper()}>{icon}</div>}
      {title && <h3 className={styles.title()}>{title}</h3>}
      {description && <p className={styles.description()}>{description}</p>}
      {action && <div className={styles.action()}>{action}</div>}
    </div>
  );
}
