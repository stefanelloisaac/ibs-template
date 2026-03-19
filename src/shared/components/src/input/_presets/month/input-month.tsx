import { useRef } from 'react';
import { useControllable } from '../../../../hooks/use-controllable';
import { IconCalendar } from '../../../icon';
import { Input } from '../../_core/input';
import type { InputMonthProps } from './input-month.types';
import { inputMonthUtils } from './input-month.utils';
import { inputMonthVariants } from './input-month.variants';

export function InputMonth(props: InputMonthProps) {
  const { className, value, defaultValue, onValueChange, onChange, errorMessage, ...rest } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const [currentValue, setCurrentValue] = useControllable<string>(value, defaultValue ?? '', onValueChange);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (!inputMonthUtils.hasValidYearLength(newValue)) {
      return;
    }

    setCurrentValue(newValue);
    onChange?.(e);
  };

  const handleIconClick = () => {
    inputRef.current?.focus();
    inputRef.current?.showPicker?.();
  };

  const styles = inputMonthVariants();
  const inputClassName = styles.root({ className });

  return (
    <Input
      {...rest}
      ref={inputRef}
      type='month'
      min={inputMonthUtils.getMinMonth()}
      max={inputMonthUtils.getMaxMonth()}
      value={currentValue}
      onChange={handleChange}
      className={inputClassName}
      errorMessage={errorMessage}
    >
      <div className={styles.actionsWrapper()}>
        <button
          type='button'
          onClick={handleIconClick}
          className={styles.actionButton()}
          aria-label='Abrir seletor de mês'
        >
          <IconCalendar size='sm' color='muted' />
        </button>
      </div>
    </Input>
  );
}

InputMonth.validatorKey = 'input-month';
