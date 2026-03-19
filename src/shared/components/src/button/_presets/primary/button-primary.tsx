import { Button } from '../../_core/button';
import type { ButtonPrimaryProps } from './button-primary.types';
import { buttonPrimaryVariants } from './button-primary.variants';

export function ButtonPrimary(props: ButtonPrimaryProps) {
  const { className, ...rest } = props;

  const styles = buttonPrimaryVariants();

  return <Button {...rest} className={styles.root({ className })} />;
}
