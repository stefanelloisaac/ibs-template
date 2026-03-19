import { Button } from '../../_core/button';
import type { ButtonOutlineProps } from './button-outline.types';
import { buttonOutlineVariants } from './button-outline.variants';

export function ButtonOutline(props: ButtonOutlineProps) {
  const { className, ...rest } = props;

  const styles = buttonOutlineVariants();

  return <Button {...rest} className={styles.root({ className })} />;
}
