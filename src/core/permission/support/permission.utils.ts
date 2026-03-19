import { PERMISSION_EMPTY, PERMISSION_WILDCARD_ACTION, PERMISSION_WILDCARD_SUBJECT } from './permission.constants';

export function permissionCreateSet(permissions: string[]): ReadonlySet<string> {
  if (permissions.length === 0) return PERMISSION_EMPTY;
  return new Set(permissions);
}

export function permissionCan(set: ReadonlySet<string>, action: string, subject: string): boolean {
  if (set.has(`${action}:${subject}`)) return true;
  if (set.has(`${action}:${PERMISSION_WILDCARD_SUBJECT}`)) return true;
  if (set.has(`${PERMISSION_WILDCARD_ACTION}:${subject}`)) return true;
  if (set.has(`${PERMISSION_WILDCARD_ACTION}:${PERMISSION_WILDCARD_SUBJECT}`)) return true;
  return false;
}

export function permissionCannot(set: ReadonlySet<string>, action: string, subject: string): boolean {
  return !permissionCan(set, action, subject);
}
