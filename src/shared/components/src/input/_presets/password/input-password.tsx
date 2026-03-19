import { useState } from 'react';
import { IconEye, IconEyeOff } from '../../../icon';
import { Input } from '../../_core/input';
import type { InputPasswordProps } from './input-password.types';
import { inputPasswordVariants } from './input-password.variants';

export function InputPassword(props: InputPasswordProps) {
  const { className, errorMessage, ...rest } = props;

  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const styles = inputPasswordVariants();
  const inputClassName = styles.root({ className });

  return (
    <Input {...rest} type={showPassword ? 'text' : 'password'} className={inputClassName} errorMessage={errorMessage}>
      <div className={styles.actionsWrapper()}>
        <button
          type='button'
          onClick={toggleVisibility}
          className={styles.toggleButton()}
          aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
        >
          {showPassword ? <IconEyeOff size='sm' color='muted' /> : <IconEye size='sm' color='muted' />}
        </button>
      </div>
    </Input>
  );
}

InputPassword.validatorKey = 'input-password';
