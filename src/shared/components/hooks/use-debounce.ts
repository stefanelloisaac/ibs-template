import { useCallback, useEffect, useRef } from 'react';

/**
 * @hook useDebounce
 * @description Atrasa a execucao de uma funcao para evitar chamadas excessivas.
 * Enquanto o usuario continua interagindo (ex: digitando em um campo de busca),
 * apenas a ultima chamada e executada apos o intervalo de espera.
 *
 * O timeout pendente e automaticamente cancelado quando o componente desmonta,
 * evitando atualizacoes de estado em componentes ja removidos.
 *
 * @param callback - Funcao a ser executada apos o intervalo de espera
 * @param delay - Tempo de espera em milissegundos antes de executar
 * @returns Funcao debounced com a mesma assinatura do callback original
 *
 * @usage DataTableHeaderFilter, InputSearch
 */

export function useDebounce<A extends unknown[]>(callback: (...args: A) => void, delay: number): (...args: A) => void {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return useCallback(
    (...args: A) => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => callbackRef.current(...args), delay);
    },
    [delay],
  );
}
