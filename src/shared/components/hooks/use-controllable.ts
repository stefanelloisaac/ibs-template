import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * @hook useControllable
 * @description Permite que o sistema consumidor controle o valor de um componente via prop `value`,
 * ou que o componente gerencie seu proprio estado interno quando `value` nao e passado.
 *
 * Este e o mecanismo central da biblioteca para integracao com sistemas externos.
 * Quando o sistema passa `value`, ele e a unica fonte de verdade — o componente apenas notifica
 * mudancas via `onChange`. Quando `value` e `undefined`, o componente funciona de forma autonoma.
 *
 * @param controlledValue - Valor vindo do sistema externo. Quando passado, o componente e controlado.
 *   Quando `undefined`, o componente usa estado interno (modo autonomo).
 * @param defaultValue - Valor inicial usado apenas no modo autonomo (sem `value` externo)
 * @param onChange - Notifica o sistema externo sobre cada mudanca de valor (funciona em ambos os modos)
 * @returns [value, setValue] - Valor atual e funcao para atualiza-lo
 *
 * @usage Accordion, AutocompleteSingle, AutocompleteMultiple, LookupSingle,
 *        LookupMultiple, Popover, Radio, Tabs
 */

export function useControllable<T>(controlledValue: T | undefined, defaultValue: T, onChange?: (value: T) => void) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      if (isControlled) {
        const resolved = typeof next === 'function' ? (next as (prev: T) => T)(controlledValue) : next;
        onChangeRef.current?.(resolved);
      } else {
        setInternalValue((prev) => {
          const resolved = typeof next === 'function' ? (next as (prev: T) => T)(prev) : next;
          onChangeRef.current?.(resolved);
          return resolved;
        });
      }
    },
    [isControlled, controlledValue],
  );

  return [value, setValue] as const;
}
