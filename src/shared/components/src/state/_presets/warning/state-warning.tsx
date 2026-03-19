import { IconAlertTriangle } from '../../../icon';
import { State } from '../../_core/state';
import type { StateWarningProps } from './state-warning.types';

export function StateWarning(props: StateWarningProps) {
  const { icon, title = 'Atenção', description = 'Verifique as informações antes de continuar.', ...rest } = props;

  return (
    <State icon={icon ?? <IconAlertTriangle color='warning' />} title={title} description={description} {...rest} />
  );
}
