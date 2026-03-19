import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useControllable } from '../../../../hooks/use-controllable';
import { Input } from '../../_core/input';
import { inputUtils } from '../../_core/input.utils';
import type { InputPercentProps } from './input-percent.types';
import { inputPercentUtils } from './input-percent.utils';
import { inputPercentVariants } from './input-percent.variants';

export function InputPercent(props: InputPercentProps) {
  const {
    locale = 'pt-BR',
    decimalPlaces = 2,
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

  const [cents, setCents] = useControllable<number>(value, defaultValue ?? 0, onValueChange);
  const [prevDecimals, setPrevDecimals] = useState(decimalPlaces);

  if (decimalPlaces !== prevDecimals) {
    setPrevDecimals(decimalPlaces);
    setCents(0);
  }

  const formatOptions = useMemo(() => ({ locale, decimalPlaces }), [locale, decimalPlaces]);

  const maxLength = useMemo(() => inputPercentUtils.getMaxLength(formatOptions), [formatOptions]);

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

    const centsStr = String(cents);
    const digitIndexToRemove = digitsBeforeCursor - 1;
    const newCentsStr = centsStr.slice(0, digitIndexToRemove) + centsStr.slice(digitIndexToRemove + 1);
    const newCents = parseInt(newCentsStr, 10) || 0;

    const newFormatted = inputPercentUtils.format(newCents, formatOptions);
    cursorRef.current = inputUtils.findCursorPosition(newFormatted, digitsBeforeCursor - 1);

    setCents(newCents);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const cursorPos = input.selectionStart ?? 0;
    const digitPosition = inputUtils.countDigits(input.value, cursorPos);

    const maxDigits = inputPercentUtils.getMaxDigits(decimalPlaces);
    const maxCents = inputPercentUtils.getMaxCents(decimalPlaces);

    const digits = inputUtils.extractDigits(input.value).slice(0, maxDigits);
    const parsed = parseInt(digits, 10) || 0;
    const newCents = Math.min(parsed, maxCents);

    const newFormatted = inputPercentUtils.format(newCents, formatOptions);

    if (hadSelectionRef.current) {
      cursorRef.current = newFormatted.length;
      hadSelectionRef.current = false;
    } else {
      cursorRef.current = inputUtils.findCursorPosition(newFormatted, digitPosition);
    }

    setCents(newCents);
    onChange?.(e);
  };

  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.setSelectionRange(cursorRef.current, cursorRef.current);
    }
  }, [cents]);

  const styles = inputPercentVariants({ align });
  const inputPercentClassName = styles.root({ className });
  const formattedValue = inputPercentUtils.format(cents, formatOptions);

  return (
    <Input
      {...rest}
      ref={inputRef}
      type='text'
      inputMode='numeric'
      className={inputPercentClassName}
      value={formattedValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onSelect={handleSelect}
      maxLength={maxLength}
    />
  );
}

InputPercent.validatorKey = 'input-percent';
