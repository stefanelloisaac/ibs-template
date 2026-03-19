import { Button } from '../../_core/button';
import type { ButtonDestructiveProps } from './button-destructive.types';
import { buttonDestructiveVariants } from './button-destructive.variants';

export function ButtonDestructive(props: ButtonDestructiveProps) {
  const { className, ...rest } = props;

  const styles = buttonDestructiveVariants();

  return <Button {...rest} className={styles.root({ className })} />;
}
