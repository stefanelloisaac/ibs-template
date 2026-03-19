import { useRef, useState } from 'react';
import { IconClose, IconUpload } from '../../../icon';
import { Input } from '../../_core/input';
import type { InputFileProps } from './input-file.types';
import { inputFileVariants } from './input-file.variants';

export function InputFile(props: InputFileProps) {
  const { className, onChange, onClear, errorMessage, ...rest } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const styles = inputFileVariants();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileName(file?.name || null);
    onChange?.(e);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inputRef.current) {
      inputRef.current.value = '';
      setFileName(null);
    }
    onClear?.();
  };

  return (
    <Input
      {...rest}
      ref={inputRef}
      type='file'
      className={styles.root({ className })}
      onChange={handleChange}
      errorMessage={errorMessage}
    >
      <div className={styles.actionsWrapper()}>
        {fileName && (
          <button type='button' onClick={handleClear} className={styles.clearButton()} aria-label='Limpar arquivo'>
            <IconClose size='sm' color='muted' />
          </button>
        )}

        <IconUpload size='sm' className={styles.icon()} color='muted' />
      </div>
    </Input>
  );
}

InputFile.validatorKey = 'input-file';
