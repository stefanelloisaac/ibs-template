import { Button } from '../../_core/button';
import type { ButtonLinkProps } from './button-link.types';
import { buttonLinkVariants } from './button-link.variants';

export function ButtonLink(props: ButtonLinkProps) {
  const { className, ...rest } = props;

  const styles = buttonLinkVariants();

  return <Button {...rest} className={styles.root({ className })} />;
}
