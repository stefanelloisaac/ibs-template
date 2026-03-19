import { Icon } from '../../_core/icon';
import type { IconSpinnerProps } from './icon-spinner.types';
import { iconSpinnerVariants } from './icon-spinner.variants';

export function IconSpinner(props: IconSpinnerProps) {
  const { className, ...rest } = props;

  const styles = iconSpinnerVariants();

  return (
    <Icon className={styles.root({ className })} size='none' {...rest}>
      <path
        fill='currentColor'
        d='M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z'
        opacity='.5'
      />
      <path fill='currentColor' d='M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z' />
    </Icon>
  );
}
