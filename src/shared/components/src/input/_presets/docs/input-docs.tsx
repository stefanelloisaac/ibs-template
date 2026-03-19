import { useLayoutEffect, useMemo, useRef } from 'react';
import { useControllable } from '../../../../hooks/use-controllable';
import { Input } from '../../_core/input';
import type { InputDocsProps } from './input-docs.types';
import { inputDocsUtils } from './input-docs.utils';
import { inputDocsVariants } from './input-docs.variants';

export function InputDocs(props: InputDocsProps) {
  const { mask, docType, value, defaultValue, onValueChange, className, onChange, errorMessage, ...rest } = props;
  void docType;

  const inputRef = useRef<HTMLInputElement>(null);
  const cursorRef = useRef<number>(0);
  const hadSelectionRef = useRef(false);

  const [raw, setRaw] = useControllable<string>(value, defaultValue ?? '', onValueChange);

  const maxLength = useMemo(() => inputDocsUtils.getMaxLength(mask), [mask]);
  const maxChars = useMemo(() => inputDocsUtils.countValidChars(mask), [mask]);

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
    if (/[a-zA-Z0-9]/.test(charBefore)) return;

    e.preventDefault();

    const charsBeforeCursor = inputDocsUtils.countCharsUpTo(input.value, cursorPos);
    if (charsBeforeCursor === 0) return;

    const charIndexToRemove = charsBeforeCursor - 1;
    const newRaw = raw.slice(0, charIndexToRemove) + raw.slice(charIndexToRemove + 1);

    const newFormatted = inputDocsUtils.format(newRaw, mask);
    cursorRef.current = inputDocsUtils.findCursorPosition(newFormatted, charsBeforeCursor - 1);

    setRaw(newRaw);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const cursorPos = input.selectionStart ?? 0;
    const charPosition = inputDocsUtils.countCharsUpTo(input.value, cursorPos);

    const extracted = inputDocsUtils.extractRaw(input.value);
    const limitedRaw = extracted.slice(0, maxChars);

    const newFormatted = inputDocsUtils.format(limitedRaw, mask);

    if (hadSelectionRef.current) {
      cursorRef.current = newFormatted.length;
      hadSelectionRef.current = false;
    } else {
      cursorRef.current = inputDocsUtils.findCursorPosition(newFormatted, charPosition);
    }

    setRaw(limitedRaw);
    onChange?.(e);
  };

  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.setSelectionRange(cursorRef.current, cursorRef.current);
    }
  }, [raw]);

  const styles = inputDocsVariants();
  const inputClassName = styles.root({ className });
  const formattedValue = inputDocsUtils.format(raw, mask);

  return (
    <Input
      {...rest}
      ref={inputRef}
      type='text'
      maxLength={maxLength}
      className={inputClassName}
      value={formattedValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onSelect={handleSelect}
      errorMessage={errorMessage}
    />
  );
}

InputDocs.getValidatorKey = (props: InputDocsProps) => `input-docs-${props.docType}`;
