import { useLayoutEffect, useMemo, useRef } from 'react';
import { useControllable } from '../../../../hooks/use-controllable';
import { Input } from '../../_core/input';
import { inputUtils } from '../../_core/input.utils';
import type { InputIntProps } from './input-int.types';
import { inputIntUtils } from './input-int.utils';
import { inputIntVariants } from './input-int.variants';

export function InputInt(props: InputIntProps) {
  const {
    locale = 'pt-BR',
    thousandSeparator = true,
    unit,
    align,
    value,
    defaultValue,
    onValueChange,
    className,
    onChange,
    ...rest
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const cursorRef = useRef<number>(0);
  const hadSelectionRef = useRef(false);

  const [currentValue, setCurrentValue] = useControllable<number>(value, defaultValue ?? 0, onValueChange);

  const formatOptions = useMemo(() => ({ locale, thousandSeparator, unit }), [locale, thousandSeparator, unit]);

  const maxLength = useMemo(() => inputIntUtils.getMaxLength(formatOptions), [formatOptions]);

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

    const valueStr = String(currentValue);
    const digitIndexToRemove = digitsBeforeCursor - 1;
    const newValueStr = valueStr.slice(0, digitIndexToRemove) + valueStr.slice(digitIndexToRemove + 1);
    const newValue = parseInt(newValueStr, 10) || 0;

    const newFormatted = inputIntUtils.format(newValue, formatOptions);
    cursorRef.current = inputUtils.findCursorPosition(newFormatted, digitsBeforeCursor - 1);

    setCurrentValue(newValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const cursorPos = input.selectionStart ?? 0;
    const digitPosition = inputUtils.countDigits(input.value, cursorPos);

    const digits = inputUtils.extractDigits(input.value).slice(0, inputIntUtils.MAX_DIGITS);
    const parsed = parseInt(digits, 10) || 0;
    const newValue = Math.min(parsed, inputIntUtils.MAX_VALUE);

    const newFormatted = inputIntUtils.format(newValue, formatOptions);

    if (hadSelectionRef.current) {
      cursorRef.current = newFormatted.length;
      hadSelectionRef.current = false;
    } else {
      cursorRef.current = inputUtils.findCursorPosition(newFormatted, digitPosition);
    }

    setCurrentValue(newValue);
    onChange?.(e);
  };

  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.setSelectionRange(cursorRef.current, cursorRef.current);
    }
  }, [currentValue]);

  const styles = inputIntVariants({ align });
  const inputIntClassName = styles.root({ className });
  const formattedValue = inputIntUtils.format(currentValue, formatOptions);

  return (
    <Input
      {...rest}
      ref={inputRef}
      type='text'
      inputMode='numeric'
      className={inputIntClassName}
      value={formattedValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onSelect={handleSelect}
      maxLength={maxLength}
    />
  );
}

InputInt.validatorKey = 'input-int';
