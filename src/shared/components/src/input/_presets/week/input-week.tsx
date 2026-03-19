import { useRef } from 'react';
import { useControllable } from '../../../../hooks/use-controllable';
import { IconCalendar } from '../../../icon';
import { Input } from '../../_core/input';
import type { InputWeekProps } from './input-week.types';
import { inputWeekUtils } from './input-week.utils';
import { inputWeekVariants } from './input-week.variants';

export function InputWeek(props: InputWeekProps) {
  const { className, value, defaultValue, onValueChange, onChange, errorMessage, ...rest } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const [currentValue, setCurrentValue] = useControllable<string>(value, defaultValue ?? '', onValueChange);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (!inputWeekUtils.hasValidYearLength(newValue)) {
      return;
    }

    setCurrentValue(newValue);
    onChange?.(e);
  };

  const handleIconClick = () => {
    inputRef.current?.focus();
    inputRef.current?.showPicker?.();
  };

  const styles = inputWeekVariants();
  const inputClassName = styles.root({ className });

  return (
    <Input
      {...rest}
      ref={inputRef}
      type='week'
      min={inputWeekUtils.getMinWeek()}
      max={inputWeekUtils.getMaxWeek()}
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
          aria-label='Abrir seletor de semana'
        >
          <IconCalendar size='sm' color='muted' />
        </button>
      </div>
    </Input>
  );
}

InputWeek.validatorKey = 'input-week';
