import { useControllable } from '../../../../hooks/use-controllable';
import { useDebounce } from '../../../../hooks/use-debounce';
import { IconClose, IconSearch } from '../../../icon';
import { Input } from '../../_core/input';
import type { InputSearchProps } from './input-search.types';
import { inputSearchUtils } from './input-search.utils';
import { inputSearchVariants } from './input-search.variants';

export function InputSearch(props: InputSearchProps) {
  const { className, value, defaultValue, onValueChange, onSearch, onChange, onClear, errorMessage, ...rest } = props;

  const [inputValue, setInputValue] = useControllable<string>(value, defaultValue ?? '', onValueChange);
  const debouncedSearch = useDebounce((value: string) => onSearch?.(value), 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(e);
    debouncedSearch(newValue);
  };

  const handleClear = () => {
    setInputValue('');
    onSearch?.('');
    onClear?.();
  };

  const styles = inputSearchVariants();
  const inputClassName = styles.root({ className });

  return (
    <Input
      {...rest}
      type='text'
      inputMode='search'
      maxLength={inputSearchUtils.MAX_LENGTH}
      className={inputClassName}
      value={inputValue}
      onChange={handleChange}
      errorMessage={errorMessage}
    >
      <div className={styles.actionsWrapper()}>
        {inputValue && (
          <button type='button' onClick={handleClear} className={styles.clearButton()} aria-label='Limpar busca'>
            <IconClose size='sm' color='muted' />
          </button>
        )}

        <IconSearch size='sm' className={styles.icon()} color='muted' aria-hidden />
      </div>
    </Input>
  );
}

InputSearch.validatorKey = 'input-search';
