import { Button } from '../../_core/button';
import type { ButtonIconProps } from './button-icon.types';
import { buttonIconVariants } from './button-icon.variants';

export function ButtonIcon(props: ButtonIconProps) {
  const { className, variant, size, icon, ...rest } = props;

  const styles = buttonIconVariants({ variant, size });

  return <Button {...rest} className={styles.root({ className })} icon={icon} />;
}
