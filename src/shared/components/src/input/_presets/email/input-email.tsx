import { useControllable } from '../../../../hooks/use-controllable';
import { IconClose } from '../../../icon';
import { Input } from '../../_core/input';
import type { InputEmailProps } from './input-email.types';
import { inputEmailUtils } from './input-email.utils';
import { inputEmailVariants } from './input-email.variants';

export function InputEmail(props: InputEmailProps) {
  const { className, value, defaultValue, onChange, onValueChange, onClear, errorMessage, ...rest } = props;

  const [inputValue, setInputValue] = useControllable<string>(value, defaultValue ?? '', onValueChange);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange?.(e);
  };

  const handleClear = () => {
    setInputValue('');
    onClear?.();
  };

  const styles = inputEmailVariants();
  const inputClassName = styles.root({ className });

  return (
    <Input
      {...rest}
      type='email'
      inputMode='email'
      maxLength={inputEmailUtils.MAX_LENGTH}
      className={inputClassName}
      value={inputValue}
      onChange={handleChange}
      errorMessage={errorMessage}
    >
      {inputValue && (
        <div className={styles.actionsWrapper()}>
          <button type='button' onClick={handleClear} className={styles.clearButton()} aria-label='Limpar'>
            <IconClose size='sm' color='muted' />
          </button>
        </div>
      )}
    </Input>
  );
}

InputEmail.validatorKey = 'input-email';
