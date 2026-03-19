import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useControllable } from '../../../../hooks/use-controllable';
import { Input } from '../../_core/input';
import { inputUtils } from '../../_core/input.utils';
import type { InputMoneyProps } from './input-money.types';
import { inputMoneyUtils } from './input-money.utils';
import { inputMoneyVariants } from './input-money.variants';

export function InputMoney(props: InputMoneyProps) {
  const {
    locale = 'pt-BR',
    currency = 'BRL',
    decimalPlaces = 2,
    allowNegative = false,
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

  const [signedCents, setSignedCents] = useControllable<number>(value, defaultValue ?? 0, onValueChange);
  const [prevDecimals, setPrevDecimals] = useState(decimalPlaces);

  if (decimalPlaces !== prevDecimals) {
    setPrevDecimals(decimalPlaces);
    setSignedCents(0);
  }

  const cents = Math.abs(signedCents);
  const isNegative = signedCents < 0;

  const formatOptions = useMemo(() => ({ locale, currency, decimalPlaces }), [locale, currency, decimalPlaces]);

  const maxLength = useMemo(() => {
    const baseLength = inputMoneyUtils.getMaxLength(formatOptions);
    if (!allowNegative) return baseLength;
    const maxCents = inputMoneyUtils.getMaxCents(formatOptions.decimalPlaces ?? 2);
    return inputMoneyUtils.format(-maxCents, formatOptions).length;
  }, [formatOptions, allowNegative]);

  const handleSelect = () => {
    if (inputRef.current) {
      const { selectionStart, selectionEnd } = inputRef.current;
      hadSelectionRef.current = selectionStart !== selectionEnd;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '-' && allowNegative) {
      e.preventDefault();
      const input = e.currentTarget;
      const cursorPos = input.selectionStart ?? 0;
      const digitPos = inputUtils.countDigits(input.value, cursorPos);

      const newSignedCents = cents > 0 ? -signedCents : 0;
      const newFormatted = inputMoneyUtils.format(newSignedCents, formatOptions);
      cursorRef.current = inputUtils.findCursorPosition(newFormatted, digitPos);

      setSignedCents(newSignedCents);
      return;
    }

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

    const newSignedCents = isNegative && newCents > 0 ? -newCents : newCents;
    const newFormatted = inputMoneyUtils.format(newSignedCents, formatOptions);
    cursorRef.current = inputUtils.findCursorPosition(newFormatted, digitsBeforeCursor - 1);

    setSignedCents(newSignedCents);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const cursorPos = input.selectionStart ?? 0;
    const digitPosition = inputUtils.countDigits(input.value, cursorPos);

    const maxDigits = inputMoneyUtils.getMaxDigits(decimalPlaces);
    const maxCents = inputMoneyUtils.getMaxCents(decimalPlaces);

    const digits = inputUtils.extractDigits(input.value).slice(0, maxDigits);
    const parsed = parseInt(digits, 10) || 0;
    const newCents = Math.min(parsed, maxCents);

    const newSignedCents = isNegative && newCents > 0 ? -newCents : newCents;
    const newFormatted = inputMoneyUtils.format(newSignedCents, formatOptions);

    if (hadSelectionRef.current) {
      cursorRef.current = newFormatted.length;
      hadSelectionRef.current = false;
    } else {
      cursorRef.current = inputUtils.findCursorPosition(newFormatted, digitPosition);
    }

    setSignedCents(newSignedCents);
    onChange?.(e);
  };

  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.setSelectionRange(cursorRef.current, cursorRef.current);
    }
  }, [signedCents]);

  const styles = inputMoneyVariants({ align });
  const inputMoneyClassName = styles.root({ className });
  const formattedValue = inputMoneyUtils.format(signedCents, formatOptions);

  return (
    <Input
      {...rest}
      ref={inputRef}
      type='text'
      inputMode='numeric'
      className={inputMoneyClassName}
      value={formattedValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onSelect={handleSelect}
      maxLength={maxLength}
    />
  );
}

InputMoney.validatorKey = 'input-money';
