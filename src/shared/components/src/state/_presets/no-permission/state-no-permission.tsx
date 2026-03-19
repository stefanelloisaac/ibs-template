import { IconLock } from '../../../icon';
import { State } from '../../_core/state';
import type { StateNoPermissionProps } from './state-no-permission.types';

export function StateNoPermission(props: StateNoPermissionProps) {
  const {
    icon,
    title = 'Acesso não autorizado',
    description = 'Você não tem permissão para acessar este recurso.',
    ...rest
  } = props;

  return <State icon={icon ?? <IconLock color='warning' />} title={title} description={description} {...rest} />;
}
