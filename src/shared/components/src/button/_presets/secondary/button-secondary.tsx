import { Button } from '../../_core/button';
import type { ButtonSecondaryProps } from './button-secondary.types';
import { buttonSecondaryVariants } from './button-secondary.variants';

export function ButtonSecondary(props: ButtonSecondaryProps) {
  const { className, ...rest } = props;

  const styles = buttonSecondaryVariants();

  return <Button {...rest} className={styles.root({ className })} />;
}
