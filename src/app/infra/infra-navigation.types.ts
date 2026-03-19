import type { ApiInfraEvent } from '@/core/api';
import type { SocketInfraEvent } from '@/core/socket';

export type InfraEvent = ApiInfraEvent | SocketInfraEvent;
