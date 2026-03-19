import { Input } from '../../_core/input';
import type { InputColorProps } from './input-color.types';
import { inputColorVariants } from './input-color.variants';

export function InputColor(props: InputColorProps) {
  const { className, ...rest } = props;

  const styles = inputColorVariants();

  return <Input {...rest} type='color' className={styles.root({ className })} />;
}

InputColor.validatorKey = 'input-color';
