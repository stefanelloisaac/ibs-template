import { apiRequest } from '@/core/api';

export async function permissionFetchUserPermissions(): Promise<string[]> {
  return apiRequest<string[]>('/auth/permissions');
}
