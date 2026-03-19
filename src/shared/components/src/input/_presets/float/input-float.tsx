import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useControllable } from '../../../../hooks/use-controllable';
import { Input } from '../../_core/input';
import { inputUtils } from '../../_core/input.utils';
import type { InputFloatProps } from './input-float.types';
import { inputFloatUtils } from './input-float.utils';
import { inputFloatVariants } from './input-float.variants';

export function InputFloat(props: InputFloatProps) {
  const {
    locale = 'pt-BR',
    decimalPlaces = 2,
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

  const [smallestUnit, setSmallestUnit] = useControllable<number>(value, defaultValue ?? 0, onValueChange);
  const [prevDecimals, setPrevDecimals] = useState(decimalPlaces);

  if (decimalPlaces !== prevDecimals) {
    setPrevDecimals(decimalPlaces);
    setSmallestUnit(0);
  }

  const formatOptions = useMemo(
    () => ({ locale, decimalPlaces, thousandSeparator, unit }),
    [locale, decimalPlaces, thousandSeparator, unit],
  );

  const maxLength = useMemo(() => inputFloatUtils.getMaxLength(formatOptions), [formatOptions]);

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

    const unitStr = String(smallestUnit);
    const digitIndexToRemove = digitsBeforeCursor - 1;
    const newUnitStr = unitStr.slice(0, digitIndexToRemove) + unitStr.slice(digitIndexToRemove + 1);
    const newSmallestUnit = parseInt(newUnitStr, 10) || 0;

    const newFormatted = inputFloatUtils.format(newSmallestUnit, formatOptions);
    cursorRef.current = inputUtils.findCursorPosition(newFormatted, digitsBeforeCursor - 1);

    setSmallestUnit(newSmallestUnit);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const cursorPos = input.selectionStart ?? 0;
    const digitPosition = inputUtils.countDigits(input.value, cursorPos);

    const maxDigits = inputFloatUtils.getMaxDigits(decimalPlaces);
    const maxSmallestUnit = inputFloatUtils.getMaxSmallestUnit(decimalPlaces);

    const digits = inputUtils.extractDigits(input.value).slice(0, maxDigits);
    const parsed = parseInt(digits, 10) || 0;
    const newSmallestUnit = Math.min(parsed, maxSmallestUnit);

    const newFormatted = inputFloatUtils.format(newSmallestUnit, formatOptions);

    if (hadSelectionRef.current) {
      cursorRef.current = newFormatted.length;
      hadSelectionRef.current = false;
    } else {
      cursorRef.current = inputUtils.findCursorPosition(newFormatted, digitPosition);
    }

    setSmallestUnit(newSmallestUnit);
    onChange?.(e);
  };

  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.setSelectionRange(cursorRef.current, cursorRef.current);
    }
  }, [smallestUnit]);

  const styles = inputFloatVariants({ align });
  const inputFloatClassName = styles.root({ className });
  const formattedValue = inputFloatUtils.format(smallestUnit, formatOptions);

  return (
    <Input
      {...rest}
      ref={inputRef}
      type='text'
      inputMode='numeric'
      className={inputFloatClassName}
      value={formattedValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onSelect={handleSelect}
      maxLength={maxLength}
    />
  );
}

InputFloat.validatorKey = 'input-float';
