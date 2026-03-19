import { useRef } from 'react';
import { useControllable } from '../../../../hooks/use-controllable';
import { IconCalendar } from '../../../icon';
import { Input } from '../../_core/input';
import type { InputDateProps } from './input-date.types';
import { inputDateUtils } from './input-date.utils';
import { inputDateVariants } from './input-date.variants';

export function InputDate(props: InputDateProps) {
  const { className, value, defaultValue, onValueChange, onChange, errorMessage, ...rest } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const [currentValue, setCurrentValue] = useControllable<string>(value, defaultValue ?? '', onValueChange);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (!inputDateUtils.hasValidYearLength(newValue)) {
      return;
    }

    setCurrentValue(newValue);
    onChange?.(e);
  };

  const handleIconClick = () => {
    inputRef.current?.focus();
    inputRef.current?.showPicker?.();
  };

  const styles = inputDateVariants();
  const inputClassName = styles.root({ className });

  return (
    <Input
      {...rest}
      ref={inputRef}
      type='date'
      min={inputDateUtils.getMinDate()}
      max={inputDateUtils.getMaxDate()}
      value={currentValue}
      onChange={handleChange}
      className={inputClassName}
      errorMessage={errorMessage}
    >
      <div className={styles.actionsWrapper()}>
        <button type='button' onClick={handleIconClick} className={styles.actionButton()} aria-label='Abrir calendário'>
          <IconCalendar size='sm' color='muted' />
        </button>
      </div>
    </Input>
  );
}

InputDate.validatorKey = 'input-date';
