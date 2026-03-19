import { isApiError } from '../support/api.error';
import type { ApiErrorContext, ApiInfraEvent } from '../support/api.types';
import { sessionHandleUnauthorized } from '@/core/session/runtime/session.runtime';

const apiInfraListeners = new Set<(event: ApiInfraEvent) => void>();

export function apiSubscribeToInfraEvents(listener: (event: ApiInfraEvent) => void): () => void {
  apiInfraListeners.add(listener);

  return () => {
    apiInfraListeners.delete(listener);
  };
}

function apiEmitInfraEvent(event: ApiInfraEvent): void {
  for (const listener of apiInfraListeners) {
    listener(event);
  }
}

export async function apiHandleGlobalError(error: Error, context: ApiErrorContext = 'query') {
  if (!isApiError(error)) {
    console.error('[API] Erro de conexao:', error.message);
    return;
  }

  switch (error.status) {
    case 401: {
      await sessionHandleUnauthorized();
      apiEmitInfraEvent({ type: 'unauthorized', source: 'api', context });
      break;
    }

    case 403:
      if (context === 'query') {
        apiEmitInfraEvent({ type: 'forbidden', source: 'api', context });
      } else {
        console.error(`[API 403] ${error.body?.message ?? 'Sem permissao para esta acao.'}`);
      }
      break;

    case 404:
      if (context === 'query') {
        apiEmitInfraEvent({ type: 'not_found', source: 'api', context });
      } else {
        console.error(`[API 404] ${error.body?.message ?? 'Recurso nao encontrado.'}`);
      }
      break;

    case 400:
    case 422:
      console.error(`[API ${error.status}] ${error.body?.message ?? 'Dados invalidos.'}`);
      break;

    case 500:
      console.error('[API 500] Erro interno do servidor.');
      break;

    case 408:
      console.error('[API 408] A requisicao expirou.');
      break;

    case 429:
      console.error('[API 429] Muitas requisicoes.');
      break;

    default:
      console.error(`[API ${error.status}] ${error.body?.message ?? 'Erro inesperado.'}`);
  }
}
