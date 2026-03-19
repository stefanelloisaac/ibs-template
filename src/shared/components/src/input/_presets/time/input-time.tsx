import { useRef } from 'react';
import { IconClock } from '../../../icon';
import { Input } from '../../_core/input';
import type { InputTimeProps } from './input-time.types';
import { inputTimeVariants } from './input-time.variants';

export function InputTime(props: InputTimeProps) {
  const { className, errorMessage, ...rest } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = () => {
    inputRef.current?.focus();
    inputRef.current?.showPicker?.();
  };

  const styles = inputTimeVariants();
  const inputClassName = styles.root({ className });

  return (
    <Input {...rest} ref={inputRef} type='time' className={inputClassName} errorMessage={errorMessage}>
      <div className={styles.actionsWrapper()}>
        <button
          type='button'
          onClick={handleIconClick}
          className={styles.actionButton()}
          aria-label='Abrir seletor de hora'
        >
          <IconClock size='sm' color='muted' />
        </button>
      </div>
    </Input>
  );
}

InputTime.validatorKey = 'input-time';
