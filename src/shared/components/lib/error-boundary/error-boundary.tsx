import { Component } from 'react';
import { IconXCircle } from '../../src/icon/_presets/x-circle/icon-x-circle';
import type { ErrorBoundaryProps, ErrorBoundaryState } from './error-boundary.types';
import { errorBoundaryVariants } from './error-boundary.variants';

const styles = errorBoundaryVariants();

/**
 * @lib ErrorBoundary
 * @description Captura erros de renderizacao em componentes filhos e exibe uma mensagem de erro
 * no lugar do componente que falhou, evitando que o erro quebre toda a aplicacao.
 *
 * Envolve cada componente da biblioteca individualmente — se um componente falha,
 * apenas ele mostra o erro, o restante da pagina continua funcionando.
 * Opcionalmente notifica o sistema consumidor via callback `onError`.
 *
 * @param children - Conteudo a ser protegido contra erros de renderizacao
 * @param onError - Callback opcional chamado quando um erro e capturado (recebe o erro e a stack)
 *
 * @usage Todos os componentes da biblioteca (Accordion, Dialog, DataTable, Sidebar, etc.)
 */

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
    this.props.onError?.(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role='alert' data-slot='error-boundary' className={styles.root()}>
          <IconXCircle size='lg' color='error' className={styles.icon()} />
          <span>{this.state.error?.message}</span>
        </div>
      );
    }

    return this.props.children;
  }
}
