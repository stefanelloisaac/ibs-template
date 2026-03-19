import { useEffect, type ReactNode } from 'react';
import { router } from '../router';
import type { InfraEvent } from './infra-navigation.types';
import { apiSubscribeToInfraEvents } from '@/core/api';
import { socketSubscribeToInfraEvents } from '@/core/socket';

function handleInfraNavigation(event: InfraEvent): void {
  switch (event.type) {
    case 'unauthorized':
      router.navigate('/login', { replace: true });
      return;

    case 'forbidden':
      router.navigate('/403');
      return;

    case 'not_found':
      router.navigate('/404');
      return;
  }
}

export function InfraNavigation({ children }: { children: ReactNode }) {
  useEffect(() => {
    const unsubscribeApi = apiSubscribeToInfraEvents(handleInfraNavigation);
    const unsubscribeSocket = socketSubscribeToInfraEvents(handleInfraNavigation);

    return () => {
      unsubscribeApi();
      unsubscribeSocket();
    };
  }, []);

  return children;
}
