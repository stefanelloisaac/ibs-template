import { useCallback, useId, useRef, useState } from 'react';
import { FormError } from '../../../form';
import { IconClose, IconUpload } from '../../../icon';
import type { InputDropzoneProps } from './input-dropzone.types';
import { inputDropzoneUtils } from './input-dropzone.utils';
import { inputDropzoneVariants } from './input-dropzone.variants';

export function InputDropzone(props: InputDropzoneProps) {
  const {
    className,
    files,
    onFilesChange,
    accept,
    maxFiles,
    maxSize,
    label,
    name,
    required,
    disabled,
    errorMessage,
    ref,
    ...rest
  } = props;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const generatedId = useId();
  const dropzoneId = props.id || generatedId;
  const errorId = `${dropzoneId}-error`;

  const resolvedIntent = errorMessage ? 'error' : undefined;

  const styles = inputDropzoneVariants({
    dragging,
    intent: resolvedIntent,
    disabled,
  });

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const newFiles = Array.from(incoming).filter((file) => {
        if (maxSize && file.size > maxSize) return false;
        return true;
      });

      const merged = [...files, ...newFiles];
      const limited = maxFiles ? merged.slice(0, maxFiles) : merged;
      onFilesChange(limited);
    },
    [files, onFilesChange, maxFiles, maxSize],
  );

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);
      if (disabled) return;
      addFiles(e.dataTransfer.files);
    },
    [disabled, addFiles],
  );

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        addFiles(e.target.files);
      }
      e.target.value = '';
    },
    [addFiles],
  );

  const handleRemove = useCallback(
    (index: number) => {
      onFilesChange(files.filter((_, i) => i !== index));
    },
    [files, onFilesChange],
  );

  const handleRemoveClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      handleRemove(Number(e.currentTarget.dataset.index));
    },
    [handleRemove],
  );

  const hiddenValue = files.map((f) => f.name).join(', ');

  const hintParts: string[] = [];
  if (accept) hintParts.push(inputDropzoneUtils.formatAccept(accept));
  if (maxSize) hintParts.push(`Máx. ${inputDropzoneUtils.formatFileSize(maxSize)}`);
  if (maxFiles) hintParts.push(`Até ${maxFiles} ${maxFiles === 1 ? 'arquivo' : 'arquivos'}`);
  const hintText = hintParts.length > 0 ? hintParts.join(' · ') : null;

  return (
    <div ref={ref} className={styles.root({ className })} {...rest}>
      <input
        ref={fileInputRef}
        type='file'
        accept={accept}
        multiple={!maxFiles || maxFiles > 1}
        disabled={disabled}
        onChange={handleFileChange}
        className='sr-only'
        tabIndex={-1}
      />

      {name && (
        <input
          type='text'
          name={name}
          value={hiddenValue}
          required={required}
          className='sr-only'
          tabIndex={-1}
          onChange={() => {}}
        />
      )}

      <div
        role='button'
        tabIndex={disabled ? -1 : 0}
        className={styles.dropzone()}
        aria-invalid={!!errorMessage}
        aria-describedby={errorMessage ? errorId : undefined}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <IconUpload size='md' color='muted' />
        <p className={styles.label()}>{label ?? 'Arraste arquivos aqui ou clique para selecionar'}</p>
        {hintText && <p className={styles.hint()}>{hintText}</p>}
      </div>

      {files.length > 0 && (
        <div className={styles.fileList()}>
          {files.map((file, index) => (
            <div key={`${file.name}-${file.size}-${index}`} className={styles.fileItem()}>
              <span className={styles.fileName()}>{file.name}</span>
              <span className={styles.fileSize()}>{inputDropzoneUtils.formatFileSize(file.size)}</span>
              <button
                type='button'
                className={styles.removeButton()}
                data-index={index}
                onClick={handleRemoveClick}
                aria-label={`Remover ${file.name}`}
                disabled={disabled}
              >
                <IconClose size='sm' />
              </button>
            </div>
          ))}
        </div>
      )}

      <FormError id={errorId} message={errorMessage} />
    </div>
  );
}

InputDropzone.validatorKey = 'input-dropzone';
