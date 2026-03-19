import { useLayoutEffect, useMemo, useRef } from 'react';
import { useControllable } from '../../../../hooks/use-controllable';
import { IconClose } from '../../../icon';
import { Input } from '../../_core/input';
import { inputUtils } from '../../_core/input.utils';
import type { InputTelProps } from './input-tel.types';
import { inputTelUtils } from './input-tel.utils';
import { inputTelVariants } from './input-tel.variants';

export function InputTel(props: InputTelProps) {
  const {
    locale = 'pt-BR',
    value,
    defaultValue,
    onValueChange,
    className,
    onChange,
    onClear,
    errorMessage,
    ...rest
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const cursorRef = useRef<number>(0);
  const hadSelectionRef = useRef(false);

  const [digits, setDigits] = useControllable<string>(value, defaultValue ?? '', onValueChange);

  const maxLength = useMemo(() => inputTelUtils.getMaxLength(locale), [locale]);

  const handleSelect = () => {
    if (inputRef.current) {
      const { selectionStart, selectionEnd } = inputRef.current;
      hadSelectionRef.current = selectionStart !== selectionEnd;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Backspace') return;

    const input = e.currentTarget;
    const { selectionStart, selectionEnd } = input;

    if (selectionStart !== selectionEnd) return;

    const cursorPos = selectionStart ?? 0;
    if (cursorPos === 0) return;

    const charBefore = input.value[cursorPos - 1];
    if (/\d/.test(charBefore)) return;

    e.preventDefault();

    const digitsBeforeCursor = inputUtils.countDigits(input.value, cursorPos);
    if (digitsBeforeCursor === 0) return;

    const digitIndexToRemove = digitsBeforeCursor - 1;
    const newDigits = digits.slice(0, digitIndexToRemove) + digits.slice(digitIndexToRemove + 1);

    const newFormatted = inputTelUtils.format(newDigits, locale);
    cursorRef.current = inputUtils.findCursorPosition(newFormatted, digitsBeforeCursor - 1);

    setDigits(newDigits);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const cursorPos = input.selectionStart ?? 0;
    const digitPosition = inputUtils.countDigits(input.value, cursorPos);

    const newDigits = inputUtils.extractDigits(input.value);
    const config = inputTelUtils.getMaskConfig(locale);
    const limitedDigits = newDigits.slice(0, config.maxDigits);

    const newFormatted = inputTelUtils.format(limitedDigits, locale);

    if (hadSelectionRef.current) {
      cursorRef.current = newFormatted.length;
      hadSelectionRef.current = false;
    } else {
      cursorRef.current = inputUtils.findCursorPosition(newFormatted, digitPosition);
    }

    setDigits(limitedDigits);
    onChange?.(e);
  };

  const handleClear = () => {
    setDigits('');
    onClear?.();
  };

  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.setSelectionRange(cursorRef.current, cursorRef.current);
    }
  }, [digits]);

  const styles = inputTelVariants();
  const inputClassName = styles.root({ className });
  const formattedValue = inputTelUtils.format(digits, locale);

  return (
    <Input
      {...rest}
      ref={inputRef}
      type='tel'
      inputMode='tel'
      maxLength={maxLength}
      className={inputClassName}
      value={formattedValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onSelect={handleSelect}
      errorMessage={errorMessage}
    >
      {digits && (
        <div className={styles.actionsWrapper()}>
          <button type='button' onClick={handleClear} className={styles.clearButton()} aria-label='Limpar'>
            <IconClose size='sm' color='muted' />
          </button>
        </div>
      )}
    </Input>
  );
}

InputTel.validatorKey = 'input-tel';
