import { useControllable } from '../../../../hooks/use-controllable';
import { IconClose } from '../../../icon';
import { Input } from '../../_core/input';
import type { InputTextProps } from './input-text.types';
import { inputTextUtils } from './input-text.utils';
import { inputTextVariants } from './input-text.variants';

export function InputText(props: InputTextProps) {
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

  const styles = inputTextVariants();
  const inputClassName = styles.root({ className });

  return (
    <Input
      {...rest}
      type='text'
      maxLength={inputTextUtils.MAX_LENGTH}
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

InputText.validatorKey = 'input-text';
