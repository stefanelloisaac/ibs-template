import { useRef } from 'react';
import { useControllable } from '../../../../hooks/use-controllable';
import { IconCalendar } from '../../../icon';
import { Input } from '../../_core/input';
import type { InputDatetimeLocalProps } from './input-datetime-local.types';
import { inputDatetimeLocalUtils } from './input-datetime-local.utils';
import { inputDatetimeLocalVariants } from './input-datetime-local.variants';

export function InputDatetimeLocal(props: InputDatetimeLocalProps) {
  const { className, value, defaultValue, onValueChange, onChange, errorMessage, ...rest } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const [currentValue, setCurrentValue] = useControllable<string>(value, defaultValue ?? '', onValueChange);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (!inputDatetimeLocalUtils.hasValidYearLength(newValue)) {
      return;
    }

    setCurrentValue(newValue);
    onChange?.(e);
  };

  const handleIconClick = () => {
    inputRef.current?.focus();
    inputRef.current?.showPicker?.();
  };

  const styles = inputDatetimeLocalVariants();
  const inputClassName = styles.root({ className });

  return (
    <Input
      {...rest}
      ref={inputRef}
      type='datetime-local'
      min={inputDatetimeLocalUtils.getMinDatetime()}
      max={inputDatetimeLocalUtils.getMaxDatetime()}
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

InputDatetimeLocal.validatorKey = 'input-datetime-local';
